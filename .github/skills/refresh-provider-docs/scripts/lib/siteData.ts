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

/**
 * `comparison.ts` is mechanically derived from `primitives.ts` (see its
 * generation code), so indexing both as independent site assertions would
 * count every claim twice and overstate the unverified surface in the
 * report. `origin` stays a field on `SiteEntry` — and the self-contradiction
 * check in `compare.ts` still groups by it — so a fixture or a future
 * hand-maintained secondary data file can still be caught disagreeing with
 * `primitives.ts`, but the live loader below only feeds it the one canonical
 * source.
 */
export function buildSiteIndex(primitives: RawPrimitive[]): SiteIndex {
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
  return buildSiteIndex(primitivesModule.primitives as RawPrimitive[])
}
