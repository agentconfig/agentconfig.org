#!/usr/bin/env bun
/**
 * Provider documentation refresh CLI.
 *
 * Usage:
 *   bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts sources [--check-urls --allow-network]
 *   bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts fetch --allow-network [--provider copilot] [--out DIR]
 *   bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts validate <claims.json>
 *   bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts compare <claims.json> [--json OUT]
 *   bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts report <claims.json> [--out REPORT.md]
 *
 * Exit codes: 0 clean, 1 fail-closed error, 2 findings require action.
 */

import { readFileSync, writeFileSync } from 'fs'
import { compareClaims } from './lib/compare.ts'
import { assertEvidence } from './lib/evidence.ts'
import { fetchSources, resolveRunDir } from './lib/fetch.ts'
import { allSources, FailClosedError, loadRegistry } from './lib/registry.ts'
import { renderReport } from './lib/report.ts'
import { validateClaims, type Claim } from './lib/schema.ts'
import { loadSiteIndex } from './lib/siteData.ts'

const EXIT_OK = 0
const EXIT_FAILED = 1
const EXIT_ACTION_REQUIRED = 2

interface Args {
  command: string
  positional: string[]
  flags: Record<string, string | boolean>
}

/** Flags this CLI understands. An unrecognized flag is a typo, and silently
 * ignoring it can widen the scope of a run, so parsing fails closed instead. */
const KNOWN_FLAGS = new Set(['allow-network', 'baseline', 'check-urls', 'json', 'manifest', 'out', 'provider', 'tracked-only'])
const VALUE_FLAGS = new Set(['baseline', 'json', 'manifest', 'out', 'provider'])

function parseArgs(argv: string[]): Args {
  const [command = 'help', ...rest] = argv
  const positional: string[] = []
  const flags: Record<string, string | boolean> = {}

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index]!
    if (!token.startsWith('--')) {
      positional.push(token)
      continue
    }
    const body = token.slice(2)
    // `--name=value` has to be handled here. Treating it as a flag literally
    // named `name=value` would leave the real flag unset, so a scoped run
    // would quietly broaden into an unscoped one.
    const separator = body.indexOf('=')
    const name = separator === -1 ? body : body.slice(0, separator)
    if (!KNOWN_FLAGS.has(name)) {
      throw new FailClosedError(`Unknown flag --${name}`, [`Supported flags: ${[...KNOWN_FLAGS].map((flag) => `--${flag}`).join(', ')}.`])
    }
    if (separator !== -1) {
      const value = body.slice(separator + 1)
      if (value.trim() === '' && VALUE_FLAGS.has(name)) {
        throw new FailClosedError(`--${name} requires a value`, [`Pass --${name} <value> instead of --${name}=.`])
      }
      flags[name] = value
      continue
    }
    const next = rest[index + 1]
    if (next && !next.startsWith('--')) {
      flags[name] = next
      index += 1
    } else {
      if (VALUE_FLAGS.has(name)) {
        throw new FailClosedError(`--${name} requires a value`, [`Pass --${name} <value>.`])
      }
      flags[name] = true
    }
  }

  return { command, positional, flags }
}

function readClaimsFile(path: string | undefined): Claim[] {
  if (!path) throw new FailClosedError('A claims file is required', ['Pass the path to the JSON file holding normalized claims.'])
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new FailClosedError(`Could not read claims from ${path}`, [String(error)])
  }

  function requireEvidenceFlags(flags: Args['flags']): { manifest: string; baseline: string } {
    if (typeof flags.manifest !== 'string') {
      throw new FailClosedError('--manifest requires a value', ['Pass the manifest.json produced by the exact fetch run used for these claims.'])
    }
    if (typeof flags.baseline !== 'string') {
      throw new FailClosedError('--baseline requires a value', ['Pass the committed baseline claims file whose claim IDs must remain covered.'])
    }
    return { manifest: flags.manifest, baseline: flags.baseline }
  }
  const result = validateClaims(raw)
  if (!result.ok) {
    throw new FailClosedError('Claims failed schema validation; nothing was compared', result.errors)
  }
  return result.value
}

function printUsage(): void {
  console.log(
    [
      'provider-docs — retrieve, validate, compare, and report on provider documentation',
      '',
      'Commands:',
      '  sources [--check-urls --allow-network]   List registered sources; optionally verify each URL resolves.',
      '  fetch --allow-network [--provider ID] [--out DIR]   Snapshot registered sources for reading.',
      '  validate <claims.json> --manifest FILE --baseline FILE   Validate normalized claims and evidence.',
      '  compare <claims.json> --manifest FILE --baseline FILE [--json OUT]   Compare verified claims.',
      '  report <claims.json> --manifest FILE --baseline FILE [--out REPORT.md]   Render the verified evidence report.',
      '',
      'Exit codes: 0 clean, 1 fail-closed error, 2 findings require action.',
    ].join('\n'),
  )
}

async function commandSources(flags: Args['flags']): Promise<number> {
  const loaded = loadRegistry()
  const sources = allSources(loaded.registry)
  console.log(`Registry version ${loaded.registry.version}: ${loaded.registry.providers.length} providers, ${sources.length} sources.`)

  for (const provider of loaded.registry.providers) {
    console.log(`\n${provider.name} (${provider.id}, ${provider.coverage})`)
    for (const source of provider.sources) {
      console.log(`  ${source.id.padEnd(34)} ${source.topic.padEnd(14)} ${source.authority.padEnd(9)} ${source.url}`)
    }
  }

  if (!flags['check-urls']) return EXIT_OK

  const results = await fetchSources(loaded, {
    allowNetwork: flags['allow-network'] === true,
    runDir: resolveRunDir(typeof flags.out === 'string' ? flags.out : undefined),
  })
  const broken = results.filter((result) => !result.ok)
  console.log(`\nURL check: ${results.length - broken.length}/${results.length} sources resolved.`)
  for (const result of broken) {
    console.log(`  BROKEN ${result.sourceId} status=${result.status} ${result.requestedUrl}${result.error ? ` (${result.error})` : ''}`)
  }
  return broken.length > 0 ? EXIT_FAILED : EXIT_OK
}

async function commandFetch(flags: Args['flags']): Promise<number> {
  const loaded = loadRegistry()
  // A bare `--provider` parses as boolean true. Treating that as "no filter"
  // would silently broaden a targeted refresh into a full retrieval, so a
  // malformed flag fails closed instead.
  if (flags.provider !== undefined && typeof flags.provider !== 'string') {
    throw new FailClosedError('--provider requires a value', ['Pass --provider <id>, or omit the flag to retrieve every registered provider.'])
  }
  if (flags.out !== undefined && typeof flags.out !== 'string') {
    throw new FailClosedError('--out requires a value', ['Pass --out <directory>, or omit the flag to use the default snapshot root.'])
  }
  if (typeof flags.provider === 'string' && flags.provider.trim() === '') {
    throw new FailClosedError('--provider requires a non-empty value', ['Pass --provider <id>, or omit the flag to retrieve every registered provider.'])
  }
  const providers = typeof flags.provider === 'string' ? [flags.provider] : undefined
  const outDir = resolveRunDir(typeof flags.out === 'string' ? flags.out : undefined)
  const results = await fetchSources(loaded, {
    allowNetwork: flags['allow-network'] === true,
    runDir: outDir,
    ...(providers ? { providers } : {}),
    trackedOnly: flags['tracked-only'] === true,
  })

  const failed = results.filter((result) => !result.ok)
  for (const result of results) {
    const state = result.ok ? 'ok    ' : 'FAILED'
    console.log(`${state} ${result.sourceId.padEnd(34)} ${String(result.status).padEnd(4)} ${result.bytes} bytes`)
  }
  console.log(`\nSnapshots written to ${outDir}`)
  console.log(`Read these snapshots, then write normalized claims. Do not record a claim you cannot cite to one of these files.`)

  if (failed.length > 0) {
    console.error(`\n${failed.length} source(s) could not be retrieved. Fail closed: do not publish claims for them.`)
    return EXIT_FAILED
  }
  return EXIT_OK
}

function commandValidate(positional: string[], flags: Args['flags']): number {
  const claims = readClaimsFile(positional[0])
  const evidence = requireEvidenceFlags(flags)
  assertEvidence(claims, evidence.manifest, evidence.baseline)
  console.log(`${claims.length} claims passed schema and evidence validation.`)
  return EXIT_OK
}

async function runComparison(positional: string[], flags: Args['flags']) {
  const claims = readClaimsFile(positional[0])
  const evidence = requireEvidenceFlags(flags)
  assertEvidence(claims, evidence.manifest, evidence.baseline)
  const loaded = loadRegistry()
  const site = await loadSiteIndex()
  const result = compareClaims(claims, site, loaded)
  return { claims, loaded, result }
}

async function commandCompare(positional: string[], flags: Args['flags']): Promise<number> {
  const { result } = await runComparison(positional, flags)

  for (const finding of result.findings) {
    console.log(`${finding.status.padEnd(11)} ${finding.action.padEnd(18)} ${finding.provider}/${finding.primitive}/${finding.aspect} — ${finding.detail}`)
  }
  console.log(
    `\nconfirmed=${result.counts.confirmed} changed=${result.counts.changed} ambiguous=${result.counts.ambiguous} unsupported=${result.counts.unsupported} unverified-site-assertions=${result.unverifiedSiteEntries}`,
  )

  if (typeof flags.json === 'string') {
    writeFileSync(flags.json, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
    console.log(`Structured findings written to ${flags.json}`)
  }

  return result.needsAction ? EXIT_ACTION_REQUIRED : EXIT_OK
}

async function commandReport(positional: string[], flags: Args['flags']): Promise<number> {
  const { claims, loaded, result } = await runComparison(positional, flags)
  const markdown = renderReport(result, { registryVersion: loaded.registry.version, claimCount: claims.length })

  if (typeof flags.out === 'string') {
    writeFileSync(flags.out, `${markdown}\n`, 'utf8')
    console.log(`Report written to ${flags.out}`)
  } else {
    console.log(markdown)
  }

  return result.needsAction ? EXIT_ACTION_REQUIRED : EXIT_OK
}

async function main(): Promise<number> {
  const { command, positional, flags } = parseArgs(process.argv.slice(2))

  switch (command) {
    case 'sources':
      return commandSources(flags)
    case 'fetch':
      return commandFetch(flags)
    case 'validate':
      return commandValidate(positional, flags)
    case 'compare':
      return commandCompare(positional, flags)
    case 'report':
      return commandReport(positional, flags)
    case 'help':
    case '--help':
    case '-h':
      printUsage()
      return EXIT_OK
    default:
      console.error(`Unknown command "${command}".\n`)
      printUsage()
      return EXIT_FAILED
  }
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    if (error instanceof FailClosedError) {
      console.error(`${error.message}`)
      for (const detail of error.details) console.error(`  - ${detail}`)
    } else {
      console.error(String(error))
    }
    process.exit(EXIT_FAILED)
  })
