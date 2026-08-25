import { join } from 'path'
import { projectRoot } from './registry.ts'
import type { Aspect } from './schema.ts'

/** One published assertion the site currently makes about a provider. */
export interface SiteEntry {
  provider: string
  primitive: string
  aspect: Aspect
  value: string
  sourceUrl: string | null
  origin: 'primitives.ts' | 'comparison.ts'
}

export interface SiteIndex {
  entries: SiteEntry[]
  providers: string[]
  primitives: string[]
}

interface RawImplementation {
  provider: string
  implementation: string
  location: string
  support: string
  sourceUrl?: string
}

interface RawPrimitive {
  id: string
  name: string
  implementations: RawImplementation[]
}

interface RawSupport {
  level: string
  implementation: string
  location: string
  sourceUrl?: string
}

const COMPARISON_PROVIDER_KEYS = ['copilot', 'claude', 'cursor', 'codex'] as const

function pushEntries(
  entries: SiteEntry[],
  origin: SiteEntry['origin'],
  provider: string,
  primitive: string,
  fields: { artifact: string; location: string; support: string; sourceUrl?: string | undefined },
): void {
  const sourceUrl = fields.sourceUrl ?? null
  entries.push({ provider, primitive, aspect: 'artifact', value: fields.artifact, sourceUrl, origin })
  entries.push({ provider, primitive, aspect: 'location', value: fields.location, sourceUrl, origin })
  entries.push({ provider, primitive, aspect: 'support', value: fields.support, sourceUrl, origin })
}

export function buildSiteIndex(primitives: RawPrimitive[], comparisonRows: Record<string, unknown>[]): SiteIndex {
  const entries: SiteEntry[] = []

  for (const primitive of primitives) {
    for (const implementation of primitive.implementations) {
      pushEntries(entries, 'primitives.ts', implementation.provider, primitive.id, {
        artifact: implementation.implementation,
        location: implementation.location,
        support: implementation.support,
        sourceUrl: implementation.sourceUrl,
      })
    }
  }

  for (const row of comparisonRows) {
    const primitiveId = String(row.primitiveId ?? '')
    if (primitiveId === '') continue
    for (const providerKey of COMPARISON_PROVIDER_KEYS) {
      const support = row[providerKey] as RawSupport | undefined
      if (!support) continue
      pushEntries(entries, 'comparison.ts', providerKey, primitiveId, {
        artifact: support.implementation,
        location: support.location,
        support: support.level,
        sourceUrl: support.sourceUrl,
      })
    }
  }

  return {
    entries,
    providers: [...new Set(entries.map((entry) => entry.provider))].sort(),
    primitives: [...new Set(entries.map((entry) => entry.primitive))].sort(),
  }
}

/** Load the live site data. Reads local TypeScript modules; performs no network access. */
export async function loadSiteIndex(root: string = projectRoot): Promise<SiteIndex> {
  const dataDir = join(root, 'site/src/data')
  const primitivesModule = await import(join(dataDir, 'primitives.ts'))
  const comparisonModule = await import(join(dataDir, 'comparison.ts'))
  return buildSiteIndex(primitivesModule.primitives as RawPrimitive[], comparisonModule.comparisonData as Record<string, unknown>[])
}
