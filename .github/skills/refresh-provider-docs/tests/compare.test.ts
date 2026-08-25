import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { compareClaims } from '../scripts/lib/compare.ts'
import { loadRegistry } from '../scripts/lib/registry.ts'
import { renderReport } from '../scripts/lib/report.ts'
import { validateClaims, type Claim, type Finding } from '../scripts/lib/schema.ts'
import type { SiteIndex } from '../scripts/lib/siteData.ts'

const fixtures = join(dirname(fileURLToPath(import.meta.url)), '../fixtures')
const registry = loadRegistry(join(fixtures, 'registry.json'))
const site = JSON.parse(readFileSync(join(fixtures, 'site-index.json'), 'utf8')) as SiteIndex
const NOW = new Date('2026-08-26T00:00:00Z')

function claimsFrom(name: string): Claim[] {
  const result = validateClaims(JSON.parse(readFileSync(join(fixtures, 'claims', name), 'utf8')))
  if (!result.ok) throw new Error(`fixture ${name} failed validation: ${result.errors.join(', ')}`)
  return result.value
}

function run(name: string) {
  return compareClaims(claimsFrom(name), site, registry, { now: NOW })
}

function byId(findings: Finding[], claimId: string): Finding {
  const found = findings.find((finding) => finding.claimId === claimId)
  if (!found) throw new Error(`no finding for ${claimId}`)
  return found
}

describe('comparison against published site data', () => {
  const result = run('valid.json')

  test('confirms a published value that matches its primary source', () => {
    const finding = byId(result.findings, 'c.confirmed')
    expect(finding.status).toBe('confirmed')
    expect(finding.action).toBe('none')
  })

  test('flags a documented value the site contradicts', () => {
    const finding = byId(result.findings, 'c.changed')
    expect(finding.status).toBe('changed')
    expect(finding.action).toBe('update-site-data')
    expect(finding.siteValue).toBe('OLD.md')
    expect(finding.documentedValue).toBe('NEW.md')
  })

  test('routes an aspect the site does not model to content design', () => {
    const finding = byId(result.findings, 'c.unmodeled-aspect')
    expect(finding.status).toBe('changed')
    expect(finding.action).toBe('extend-site-model')
  })

  test('routes an unmodeled primitive to content design', () => {
    expect(byId(result.findings, 'c.unknown-primitive').action).toBe('extend-site-model')
  })

  test('routes an unpublished provider to content design', () => {
    expect(byId(result.findings, 'c.unpublished-provider').action).toBe('extend-site-model')
  })

  test('marks a documented lack of support as unsupported', () => {
    const finding = byId(result.findings, 'c.unsupported')
    expect(finding.status).toBe('unsupported')
    expect(finding.action).toBe('update-site-data')
  })

  test('reports that action is required', () => {
    expect(result.needsAction).toBe(true)
    expect(result.counts.confirmed).toBe(1)
  })

  test('counts published assertions no source spoke to', () => {
    expect(result.unverifiedSiteEntries).toBeGreaterThan(0)
  })
})

describe('fail-closed behavior', () => {
  test('refuses to choose between conflicting official sources', () => {
    const result = run('conflicting.json')
    expect(result.findings).toHaveLength(1)
    expect(result.findings[0]!.status).toBe('ambiguous')
    expect(result.findings[0]!.detail).toContain('disagree')
  })

  test('will not publish a claim backed only by a secondary source', () => {
    const finding = run('secondary-only.json').findings[0]!
    expect(finding.status).toBe('ambiguous')
    expect(finding.detail).toContain('secondary')
  })

  test('rejects evidence older than the freshness limit', () => {
    const finding = run('stale.json').findings[0]!
    expect(finding.status).toBe('ambiguous')
    expect(finding.detail).toContain('freshness')
  })

  test('rejects a source that is not in the registry', () => {
    const finding = run('unregistered-source.json').findings[0]!
    expect(finding.status).toBe('ambiguous')
    expect(finding.detail).toContain('not in the registry')
  })

  test('rejects a citation that does not match the registered URL', () => {
    const finding = run('url-mismatch.json').findings[0]!
    expect(finding.status).toBe('ambiguous')
    expect(finding.detail).toContain('does not match')
  })

  test('rejects a descendant page as evidence for the registered page', () => {
    const findings = run('url-descendant.json').findings
    const descendant = byId(findings, 'c.descendant')
    expect(descendant.status).toBe('ambiguous')
    expect(descendant.detail).toContain('does not match')
  })

  test('still accepts a fragment on the registered page', () => {
    const fragment = byId(run('url-descendant.json').findings, 'c.fragment')
    expect(fragment.status).toBe('confirmed')
  })

  test('rejects a source borrowed from another provider', () => {
    const finding = run('provider-mismatch.json').findings[0]!
    expect(finding.status).toBe('ambiguous')
    expect(finding.detail).toContain('belongs to provider')
  })

  test('refuses to compare while the site contradicts itself', () => {
    const finding = run('site-inconsistent.json').findings[0]!
    expect(finding.status).toBe('ambiguous')
    expect(finding.detail).toContain('contradicts itself')
  })

  test('every ambiguous finding asks for a human', () => {
    for (const name of ['conflicting.json', 'secondary-only.json', 'stale.json', 'unregistered-source.json', 'url-mismatch.json', 'provider-mismatch.json', 'site-inconsistent.json']) {
      for (const finding of run(name).findings) {
        expect(finding.action).toBe('human-review')
      }
    }
  })
})

describe('evidence report', () => {
  const result = run('valid.json')
  const markdown = renderReport(result, { generatedAt: '2026-08-26T00:00:00Z', registryVersion: 1, claimCount: 6 })

  test('cites a source and a retrieval date for every published row', () => {
    expect(markdown).toContain('https://docs.example.com/testprov/hooks')
    expect(markdown).toContain('2026-08-25')
  })

  test('separates what needs a decision from what needs an edit', () => {
    expect(markdown).toContain('Ambiguous — needs a human decision')
    expect(markdown).toContain('Changed — documentation and the site disagree')
  })

  test('states how much of the site went unverified', () => {
    expect(markdown).toContain('Site assertions this run did not verify')
  })

  test('does not invent a value that no claim carried', () => {
    expect(markdown).not.toContain('undefined')
    expect(markdown).not.toContain('[object Object]')
  })

  test('escapes path characters that Markdown would otherwise swallow', () => {
    const escaped = renderReport(
      {
        findings: [
          {
            claimId: 'c.escaping',
            provider: 'testprov',
            primitive: 'skills',
            aspect: 'location',
            status: 'changed',
            action: 'update-site-data',
            siteValue: '.cursor/rules/*.md',
            documentedValue: '<name>/SKILL.md and .agent/*_rules',
            sourceUrl: 'https://docs.example.com/testprov/skills',
            sourceAuthority: 'primary',
            retrievedAt: '2026-08-25',
            detail: 'escaping check',
          },
        ],
        counts: { confirmed: 0, changed: 1, ambiguous: 0, unsupported: 0 },
        unverifiedSiteEntries: 0,
        needsAction: true,
      },
      { generatedAt: '2026-08-26T00:00:00Z', registryVersion: 1, claimCount: 1 },
    )
    expect(escaped).toContain('\\<name\\>')
    expect(escaped).toContain('\\*.md')
    expect(escaped).toContain('\\_rules')
  })
})
