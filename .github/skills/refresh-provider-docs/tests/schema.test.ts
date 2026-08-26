import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { canonicalize, validateClaims, validateEvidence, validateManifest, validateRegistry, type FetchManifest } from '../scripts/lib/schema.ts'

const fixtures = join(dirname(fileURLToPath(import.meta.url)), '../fixtures')

function readFixture(relativePath: string): unknown {
  return JSON.parse(readFileSync(join(fixtures, relativePath), 'utf8'))
}

describe('claim schema', () => {
  test('accepts a well-formed claim set', () => {
    const result = validateClaims(readFixture('claims/valid.json'))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.length).toBe(6)
  })

  test('rejects malformed claims and explains every problem', () => {
    const result = validateClaims(readFixture('claims/malformed.json'))
    expect(result.ok).toBe(false)
    if (result.ok) return
    const joined = result.errors.join('\n')
    expect(joined).toContain('aspect')
    expect(joined).toContain('sourceAuthority')
    expect(joined).toContain('retrievedAt')
    expect(joined).toContain('https')
    expect(joined).toContain('notes')
  })

  test('treats an empty result as a failed retrieval rather than a clean run', () => {
    const result = validateClaims([])
    expect(result.ok).toBe(false)
  })

  test('rejects a support claim that is not a known support level', () => {
    const supportClaim = (value: unknown) => [
      {
        id: 'x',
        provider: 'testprov',
        primitive: 'hooks',
        aspect: 'support',
        value,
        sourceId: 'testprov.hooks',
        sourceUrl: 'https://docs.example.com/testprov/hooks',
        sourceAuthority: 'primary',
        retrievedAt: '2026-08-25',
      },
    ]
    expect(validateClaims(supportClaim('mostly')).ok).toBe(false)
    expect(validateClaims(supportClaim(['full', 'none'])).ok).toBe(false)
    expect(validateClaims(supportClaim(['full'])).ok).toBe(false)
    expect(validateClaims(supportClaim('full')).ok).toBe(true)
  })

  test('rejects duplicate claim ids', () => {
    const claims = readFixture('claims/valid.json') as unknown[]
    expect(validateClaims([claims[0], claims[0]]).ok).toBe(false)
  })

  test('rejects an impossible calendar date that JavaScript would silently roll forward', () => {
    const claim = (retrievedAt: string) => [
      {
        id: 'x',
        provider: 'testprov',
        primitive: 'hooks',
        aspect: 'location',
        value: '.testprov/hooks.json',
        sourceId: 'testprov.hooks',
        sourceUrl: 'https://docs.example.com/testprov/hooks',
        sourceAuthority: 'primary',
        retrievedAt,
      },
    ]
    expect(validateClaims(claim('2026-02-31')).ok).toBe(false)
    expect(validateClaims(claim('2026-13-01')).ok).toBe(false)
    expect(validateClaims(claim('2025-02-29')).ok).toBe(false)
    expect(validateClaims(claim('2024-02-29')).ok).toBe(true)
    expect(validateClaims(claim('2026-08-25T06:08:01.937Z')).ok).toBe(true)
    expect(validateClaims(claim('2026-08-25T23:00:00-05:00')).ok).toBe(true)
  })

  test('rejects a URL with no host, which no one could open', () => {
    const urlClaim = (sourceUrl: string) => [
      {
        id: 'x',
        provider: 'testprov',
        primitive: 'hooks',
        aspect: 'location',
        value: '.testprov/hooks.json',
        sourceId: 'testprov.hooks',
        sourceUrl,
        sourceAuthority: 'primary',
        retrievedAt: '2026-08-25',
      },
    ]
    expect(validateClaims(urlClaim('https://')).ok).toBe(false)
    expect(validateClaims(urlClaim('not a url')).ok).toBe(false)
    expect(validateClaims(urlClaim('http://docs.example.com/testprov/hooks')).ok).toBe(false)
    expect(validateClaims(urlClaim('https://docs.example.com/testprov/hooks')).ok).toBe(true)
  })
})

describe('registry schema', () => {
  test('accepts the fixture registry', () => {
    expect(validateRegistry(readFixture('registry.json')).ok).toBe(true)
  })

  describe('manifest-bound evidence', () => {
    const claims = readFixture('claims/valid.json')
    const manifest: FetchManifest = {
      retrievedAt: '2026-08-25T12:00:00Z',
      results: [
        {
          sourceId: 'testprov.hooks',
          provider: 'testprov',
          url: 'https://docs.example.com/testprov/hooks',
          requestedUrl: 'https://docs.example.com/testprov/hooks',
          finalUrl: 'https://docs.example.com/testprov/hooks',
          status: 200,
          ok: true,
          bytes: 100,
          contentType: 'text/html',
          retrievedAt: '2026-08-25T12:00:00Z',
          snapshotPath: '/tmp/testprov.hooks.md',
        },
        {
          sourceId: 'testprov.instructions',
          provider: 'testprov',
          url: 'https://docs.example.com/testprov/instructions',
          requestedUrl: 'https://docs.example.com/testprov/instructions',
          finalUrl: 'https://docs.example.com/testprov/instructions',
          status: 200,
          ok: true,
          bytes: 100,
          contentType: 'text/html',
          retrievedAt: '2026-08-25T12:00:00Z',
          snapshotPath: '/tmp/testprov.instructions.md',
        },
        {
          sourceId: 'otherprov.docs',
          provider: 'otherprov',
          url: 'https://docs.example.com/otherprov/instructions',
          requestedUrl: 'https://docs.example.com/otherprov/instructions',
          finalUrl: 'https://docs.example.com/otherprov/instructions',
          status: 200,
          ok: true,
          bytes: 100,
          contentType: 'text/html',
          retrievedAt: '2026-08-25T12:00:00Z',
          snapshotPath: '/tmp/otherprov.docs.md',
        },
      ],
    }

    test('accepts claims bound to successful sources in the exact manifest', () => {
      const parsed = validateClaims(claims)
      expect(parsed.ok).toBe(true)
      if (!parsed.ok) return
      expect(validateManifest(manifest).ok).toBe(true)
      expect(validateEvidence(parsed.value, manifest, parsed.value).ok).toBe(true)
    })

    test('rejects claims whose source is absent or unsuccessful', () => {
      const parsed = validateClaims(claims)
      if (!parsed.ok) throw new Error(parsed.errors.join('\n'))
      const absent = { ...manifest, results: manifest.results.filter((result) => result.sourceId !== 'testprov.hooks') }
      expect(validateEvidence(parsed.value, absent, parsed.value).ok).toBe(false)
      const failed = {
        ...manifest,
        results: manifest.results.map((result) => (result.sourceId === 'testprov.hooks' ? { ...result, ok: false } : result)),
      }
      expect(validateEvidence(parsed.value, failed, parsed.value).ok).toBe(false)
    })

    test('rejects retrieval dates that do not match the manifest', () => {
      const parsed = validateClaims(claims)
      if (!parsed.ok) throw new Error(parsed.errors.join('\n'))
      const stale = parsed.value.map((claim) => ({ ...claim, retrievedAt: '2026-08-24' }))
      expect(validateEvidence(stale, manifest, parsed.value).ok).toBe(false)
    })

    test('rejects a claim set missing a baseline claim id', () => {
      const parsed = validateClaims(claims)
      if (!parsed.ok) throw new Error(parsed.errors.join('\n'))
      expect(validateEvidence(parsed.value.slice(1), manifest, parsed.value).ok).toBe(false)
    })

    test('rejects a successful manifest entry without complete retrieval evidence', () => {
      const incomplete = {
        ...manifest,
        results: manifest.results.map((result, index) => (index === 0 ? { ...result, finalUrl: null } : result)),
      }
      expect(validateManifest(incomplete).ok).toBe(false)
    })
  })

  test('requires a tracked provider to have a primary source', () => {
    const result = validateRegistry({
      version: 1,
      maxSourceAgeDays: 30,
      providers: [
        {
          id: 'p',
          name: 'P',
          coverage: 'tracked',
          sources: [{ id: 'p.blog', topic: 'instructions', url: 'https://blog.example.com/p', authority: 'secondary', note: 'why' }],
        },
      ],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.join('\n')).toContain('primary source')
  })

  test('requires a secondary source to justify itself', () => {
    const result = validateRegistry({
      version: 1,
      maxSourceAgeDays: 30,
      providers: [
        {
          id: 'p',
          name: 'P',
          coverage: 'tracked',
          sources: [
            { id: 'p.docs', topic: 'instructions', url: 'https://docs.example.com/p', authority: 'primary' },
            { id: 'p.blog', topic: 'instructions', url: 'https://blog.example.com/p', authority: 'secondary' },
          ],
        },
      ],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.join('\n')).toContain('note')
  })

  test('rejects a source id that is not namespaced to its provider', () => {
    const result = validateRegistry({
      version: 1,
      maxSourceAgeDays: 30,
      providers: [
        { id: 'p', name: 'P', coverage: 'tracked', sources: [{ id: 'q.docs', topic: 'instructions', url: 'https://docs.example.com/q', authority: 'primary' }] },
      ],
    })
    expect(result.ok).toBe(false)
  })
})

describe('canonicalize', () => {
  test('ignores formatting differences that are not real drift', () => {
    expect(canonicalize('`AGENTS.md`')).toBe(canonicalize('AGENTS.md.'))
    expect(canonicalize('AGENTS.md or .github/copilot-instructions.md')).toBe(canonicalize(['.github/copilot-instructions.md', 'AGENTS.md']))
  })

  test('still treats a different path as different', () => {
    expect(canonicalize('.cursor/rules/*.mdc')).not.toBe(canonicalize('.cursor/rules/*.md'))
  })

  test('keeps documented order for ordered aspects so conflicting precedence stays visible', () => {
    expect(canonicalize(['managed', 'user'], 'precedence')).not.toBe(canonicalize(['user', 'managed'], 'precedence'))
  })

  test('still sorts set-valued aspects', () => {
    expect(canonicalize(['b', 'a'], 'location')).toBe(canonicalize(['a', 'b'], 'location'))
  })

  test('keeps case for path-bearing aspects, where case decides the file', () => {
    expect(canonicalize('AGENTS.md', 'location')).not.toBe(canonicalize('agents.md', 'location'))
  })

  test('still folds case for prose-valued aspects', () => {
    expect(canonicalize('Lifecycle hooks', 'artifact')).toBe(canonicalize('lifecycle hooks', 'artifact'))
  })
})

describe('secondary source notes', () => {
  function registryWithNote(note: unknown) {
    return {
      version: 1,
      maxSourceAgeDays: 30,
      providers: [
        {
          id: 'p',
          name: 'P',
          coverage: 'candidate',
          sources: [{ id: 'p.docs', topic: 'instructions', url: 'https://docs.example.com/p', authority: 'secondary', note }],
        },
      ],
    }
  }

  test('rejects a blank note, which justifies nothing', () => {
    expect(validateRegistry(registryWithNote('   ')).ok).toBe(false)
    expect(validateRegistry(registryWithNote('')).ok).toBe(false)
  })

  test('accepts a real justification', () => {
    expect(validateRegistry(registryWithNote('No primary page documents this yet.')).ok).toBe(true)
  })
})
