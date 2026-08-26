import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'fs'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { fetchSources, markdownUrlFor, newRunDir, resolveRunDir, snapshotRoot } from '../scripts/lib/fetch.ts'
import { allSources, loadRegistry } from '../scripts/lib/registry.ts'

const skillRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const loaded = loadRegistry()

/** Providers the modernization plan requires this skill to cover. */
const REQUIRED_PROVIDERS = ['copilot', 'claude', 'codex', 'cursor', 'gemini', 'windsurf', 'cline', 'devin']

describe('the shipped source registry', () => {
  test('loads and validates', () => {
    expect(loaded.registry.providers.length).toBeGreaterThan(0)
  })

  test('covers every provider the plan requires', () => {
    const ids = loaded.registry.providers.map((provider) => provider.id)
    for (const required of REQUIRED_PROVIDERS) expect(ids).toContain(required)
  })

  test('cites only https sources', () => {
    for (const source of allSources(loaded.registry)) expect(source.url.startsWith('https://')).toBe(true)
  })

  test('gives every tracked provider a primary source for instructions or hooks', () => {
    for (const provider of loaded.registry.providers) {
      if (provider.coverage !== 'tracked') continue
      const primaryTopics = provider.sources.filter((source) => source.authority === 'primary').map((source) => source.topic)
      expect(primaryTopics.length).toBeGreaterThan(0)
    }
  })

  test('keeps source ids unique across providers', () => {
    const ids = allSources(loaded.registry).map((source) => source.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('sets a freshness limit', () => {
    expect(loaded.registry.maxSourceAgeDays).toBeGreaterThan(0)
  })
})

describe('retrieval', () => {
  test('refuses to touch the network without an explicit opt-in', async () => {
    await expect(fetchSources(loaded, { allowNetwork: false })).rejects.toThrow('--allow-network')
  })

  test('prefers a markdown variant when the provider publishes one', () => {
    const source = { id: 'x.y', topic: 'hooks' as const, url: 'https://example.com/docs/hooks', authority: 'primary' as const }
    expect(markdownUrlFor(source, { markdown: '{url}.md' })).toBe('https://example.com/docs/hooks.md')
    expect(markdownUrlFor(source, { markdown: 'https://example.com/api/body?pathname={pathname}' })).toContain('%2Fdocs%2Fhooks')
    expect(markdownUrlFor(source, undefined)).toBe('https://example.com/docs/hooks')
  })

  test('fails closed on an unknown provider instead of reporting an empty run as a success', async () => {
    await expect(fetchSources(loaded, { allowNetwork: true, providers: ['copilto'] })).rejects.toThrow('Unknown provider id')
  })

  test('fails closed when tracked-only retrieval explicitly names a candidate', async () => {
    const fixture = loadRegistry(join(skillRoot, 'fixtures/registry.json'))
    await expect(fetchSources(fixture, { allowNetwork: true, providers: ['otherprov'], trackedOnly: true })).rejects.toThrow(
      'Candidate provider cannot be fetched with --tracked-only',
    )
  })

  test('gives every run its own snapshot directory', () => {
    const first = newRunDir(new Date('2026-08-26T00:00:00Z'))
    const second = newRunDir(new Date('2026-08-26T00:00:01Z'))
    expect(first).not.toBe(second)
    expect(first.startsWith(snapshotRoot)).toBe(true)
  })

  test('still makes unique run directories for the same timestamp', () => {
    const now = new Date('2026-08-26T00:00:00Z')
    const first = newRunDir(now)
    const second = newRunDir(now)
    expect(first).not.toBe(second)
  })

  test('excludes candidate providers from tracked-only retrieval', async () => {
    const fixture = loadRegistry(join(skillRoot, 'fixtures/registry.json'))
    const originalFetch = globalThis.fetch
    const out = mkdtempSync(join(tmpdir(), 'provider-docs-test-'))
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response('# docs', {
          status: 200,
          headers: { 'content-type': 'text/markdown' },
        }),
      )) as typeof fetch
    try {
      const results = await fetchSources(fixture, { allowNetwork: true, runDir: out, trackedOnly: true })
      expect(results.every((result) => result.provider === 'testprov')).toBe(true)
    } finally {
      globalThis.fetch = originalFetch
      rmSync(out, { recursive: true })
    }
  })

  test('fails oversized responses closed', async () => {
    const fixture = loadRegistry(join(skillRoot, 'fixtures/registry.json'))
    const originalFetch = globalThis.fetch
    const out = mkdtempSync(join(tmpdir(), 'provider-docs-test-'))
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response('x'.repeat(11), {
          status: 200,
          headers: { 'content-type': 'text/plain' },
        }),
      )) as typeof fetch
    try {
      const results = await fetchSources(fixture, { allowNetwork: true, runDir: out, providers: ['testprov'], maxBytes: 10 })
      expect(results.every((result) => !result.ok && result.error?.includes('exceeds'))).toBe(true)
    } finally {
      globalThis.fetch = originalFetch
      rmSync(out, { recursive: true })
    }
  })

  test('records expected final URLs and rejects unexpected redirects', async () => {
    const fixture = loadRegistry(join(skillRoot, 'fixtures/registry.json'))
    const originalFetch = globalThis.fetch
    const out = mkdtempSync(join(tmpdir(), 'provider-docs-test-'))
    globalThis.fetch = ((input) =>
      Promise.resolve(
        Object.defineProperty(
          new Response('# docs', {
            status: 200,
            headers: { 'content-type': 'text/markdown' },
          }),
          'url',
          { value: String(input) },
        ),
      )) as typeof fetch
    try {
      const results = await fetchSources(fixture, { allowNetwork: true, runDir: out, providers: ['testprov'] })
      expect(results.every((result) => result.ok && result.finalUrl === result.requestedUrl)).toBe(true)
    } finally {
      globalThis.fetch = originalFetch
      rmSync(out, { recursive: true })
    }

    const redirected = mkdtempSync(join(tmpdir(), 'provider-docs-test-'))
    globalThis.fetch = (() =>
      Promise.resolve(
        Object.defineProperty(
          new Response('# docs', {
            status: 200,
            headers: { 'content-type': 'text/markdown' },
          }),
          'url',
          { value: 'https://attacker.example/unexpected' },
        ),
      )) as typeof fetch
    try {
      const results = await fetchSources(fixture, { allowNetwork: true, runDir: redirected, providers: ['testprov'] })
      expect(results.every((result) => !result.ok && result.error?.includes('Unexpected final URL'))).toBe(true)
    } finally {
      globalThis.fetch = originalFetch
      rmSync(redirected, { recursive: true })
    }
  })
})

describe('activation', () => {
  const triggers = JSON.parse(readFileSync(join(skillRoot, 'evals/trigger-queries.json'), 'utf8')) as {
    shouldTrigger: string[]
    shouldNotTrigger: string[]
  }

  test('lists both positive and negative activation cases', () => {
    expect(triggers.shouldTrigger.length).toBeGreaterThanOrEqual(5)
    expect(triggers.shouldNotTrigger.length).toBeGreaterThanOrEqual(5)
  })

  test('keeps the two sets disjoint', () => {
    const negatives = new Set(triggers.shouldNotTrigger)
    for (const query of triggers.shouldTrigger) expect(negatives.has(query)).toBe(false)
  })

  test('describes the skill with the words that should route to it', () => {
    const skill = readFileSync(join(skillRoot, 'SKILL.md'), 'utf8')
    const description = skill.split('---')[1] ?? ''
    for (const keyword of ['provider', 'documentation', 'verify']) {
      expect(description.toLowerCase()).toContain(keyword)
    }
  })

  test('does not claim to own work that belongs to other skills', () => {
    const skill = readFileSync(join(skillRoot, 'SKILL.md'), 'utf8')
    expect(skill).toContain('add-provider')
    expect(skill).toContain('generate-llms')
  })
})

describe('snapshot run directories', () => {
  test('treats --out as a parent so two runs never share a directory', () => {
    const first = resolveRunDir('/tmp/shared-out', new Date('2026-08-25T10:00:00Z'))
    const second = resolveRunDir('/tmp/shared-out', new Date('2026-08-25T11:00:00Z'))
    expect(first.startsWith('/tmp/shared-out/')).toBe(true)
    expect(second.startsWith('/tmp/shared-out/')).toBe(true)
    expect(first).not.toBe(second)
  })

  test('falls back to the default snapshot root when no --out is given', () => {
    const run = resolveRunDir(undefined, new Date('2026-08-25T10:00:00Z'))
    expect(run.startsWith(snapshotRoot)).toBe(true)
  })
})

describe('CLI argument handling', () => {
  const cli = join(skillRoot, 'scripts/provider-docs.ts')

  function run(args: string[]): { code: number; output: string } {
    const result = Bun.spawnSync(['bun', cli, ...args], { stdout: 'pipe', stderr: 'pipe' })
    return { code: result.exitCode, output: `${result.stdout.toString()}${result.stderr.toString()}` }
  }

  test('rejects a bare --provider instead of retrieving every provider', () => {
    const { code, output } = run(['fetch', '--provider'])
    expect(code).toBe(1)
    expect(output).toContain('--provider requires a value')
  })

  test('reads --provider=value rather than mistaking it for an unknown flag', () => {
    const { code, output } = run(['fetch', '--provider=not-a-provider', '--allow-network'])
    expect(code).toBe(1)
    expect(output).toContain('not-a-provider')
  })

  test('rejects --provider= with an empty value', () => {
    const { code, output } = run(['fetch', '--provider=', '--allow-network'])
    expect(code).toBe(1)
    expect(output).toContain('--provider requires a value')
  })

  test('rejects a bare value flag instead of silently succeeding', () => {
    const out = run(['report', 'fixtures/claims/valid.json', '--out'])
    expect(out.code).toBe(1)
    expect(out.output).toContain('--out requires a value')

    const json = run(['compare', 'fixtures/claims/valid.json', '--json'])
    expect(json.code).toBe(1)
    expect(json.output).toContain('--json requires a value')
  })

  test('refuses an unrecognized flag rather than ignoring it', () => {
    const { code, output } = run(['fetch', '--allow-netwrok'])
    expect(code).toBe(1)
    expect(output).toContain('Unknown flag')
  })
})
