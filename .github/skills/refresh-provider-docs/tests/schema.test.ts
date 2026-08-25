import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { canonicalize, validateClaims, validateRegistry } from '../scripts/lib/schema.ts'

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
  })

  test('treats an empty result as a failed retrieval rather than a clean run', () => {
    const result = validateClaims([])
    expect(result.ok).toBe(false)
  })

  test('rejects a support claim that is not a known support level', () => {
    const result = validateClaims([
      {
        id: 'x',
        provider: 'testprov',
        primitive: 'hooks',
        aspect: 'support',
        value: 'mostly',
        sourceId: 'testprov.hooks',
        sourceUrl: 'https://docs.example.com/testprov/hooks',
        sourceAuthority: 'primary',
        retrievedAt: '2026-08-25',
      },
    ])
    expect(result.ok).toBe(false)
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
})

describe('registry schema', () => {
  test('accepts the fixture registry', () => {
    expect(validateRegistry(readFixture('registry.json')).ok).toBe(true)
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
