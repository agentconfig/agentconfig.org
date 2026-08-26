import { describe, expect, test } from 'bun:test'
import { buildSiteIndex } from '../scripts/lib/siteData.ts'

describe('buildSiteIndex', () => {
  test('indexes only primitives.ts, producing exactly 3 canonical entries per implementation', () => {
    const index = buildSiteIndex([
      {
        id: 'test-primitive',
        name: 'Test Primitive',
        implementations: [
          {
            provider: 'copilot',
            implementation: 'Test implementation',
            location: 'test.md',
            support: 'full',
            sourceUrl: 'https://example.com',
          },
        ],
      },
    ])

    // One implementation should yield exactly 3 entries (artifact, location,
    // support) — not 6. If comparison.ts's derived rows were ever indexed
    // alongside primitives.ts again, this count would silently double, which
    // is the exact regression that made the report overstate the unverified
    // surface (see the comment above buildSiteIndex).
    expect(index.entries).toHaveLength(3)
    expect(index.entries.every((entry) => entry.origin === 'primitives.ts')).toBe(true)
    expect(index.entries.map((entry) => entry.aspect).sort()).toEqual(['artifact', 'location', 'support'])
    expect(index.providers).toEqual(['copilot'])
    expect(index.primitives).toEqual(['test-primitive'])
  })

  test('accumulates entries across multiple primitives and implementations without duplication', () => {
    const index = buildSiteIndex([
      {
        id: 'primitive-a',
        name: 'Primitive A',
        implementations: [
          { provider: 'copilot', implementation: 'A/copilot', location: 'a.md', support: 'full' },
          { provider: 'claude', implementation: 'A/claude', location: 'CLAUDE.md', support: 'full' },
        ],
      },
      {
        id: 'primitive-b',
        name: 'Primitive B',
        implementations: [
          { provider: 'cursor', implementation: 'B/cursor', location: 'AGENTS.md', support: 'partial' },
        ],
      },
    ])

    // 3 implementations total × 3 entries each = 9, never 18.
    expect(index.entries).toHaveLength(9)
    expect(index.providers).toEqual(['claude', 'copilot', 'cursor'])
    expect(index.primitives).toEqual(['primitive-a', 'primitive-b'])
  })
})
