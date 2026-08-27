import { primitives, categories, type Provider, type SupportLevel } from './primitives'
import { providers } from './providers'

export interface ProfilePrimitiveEntry {
  id: string
  name: string
  support: SupportLevel
  implementation: string
  location: string
  sourceUrl?: string
}

export interface ProfileCategory {
  id: string
  name: string
  entries: ProfilePrimitiveEntry[]
}

export interface ProviderCoverage {
  /** Number of primitives with a provider implementation at all. */
  total: number
  /** Count by support level. */
  full: number
  partial: number
  diy: number
  /** How many implementations carry a citable primary/secondary source. */
  cited: number
}

export interface ProviderProfile {
  provider: Provider
  name: string
  icon: string
  categories: ProfileCategory[]
  coverage: ProviderCoverage
}

/**
 * Per-provider profiles, generated entirely from the
 * primitives.ts typed model (the same source primitives/comparison.ts
 * both read from). Adding or correcting a primitive automatically flows
 * through to every provider's profile with no separate data entry.
 */
export function buildProviderProfile(provider: Provider): ProviderProfile {
  const providerMeta = providers.find((p) => p.id === provider)
  if (providerMeta == null) {
    throw new Error(`Unknown provider "${provider}"`)
  }

  const categoryList = categories.filter((c) => c.id !== 'all')

  const profileCategories: ProfileCategory[] = categoryList
    .map((category) => {
      const entries: ProfilePrimitiveEntry[] = primitives
        .filter((primitive) => primitive.category === category.id)
        .flatMap((primitive) => {
          const impl = primitive.implementations.find((i) => i.provider === provider)
          if (impl == null) return []
          return [{
            id: primitive.id,
            name: primitive.name,
            support: impl.support,
            implementation: impl.implementation,
            location: impl.location,
            ...(impl.sourceUrl != null ? { sourceUrl: impl.sourceUrl } : {}),
          }]
        })
      return { id: category.id, name: category.name, entries }
    })
    .filter((category) => category.entries.length > 0)

  const allEntries = profileCategories.flatMap((c) => c.entries)
  const coverage: ProviderCoverage = {
    total: allEntries.length,
    full: allEntries.filter((e) => e.support === 'full').length,
    partial: allEntries.filter((e) => e.support === 'partial').length,
    diy: allEntries.filter((e) => e.support === 'diy').length,
    cited: allEntries.filter((e) => e.sourceUrl != null).length,
  }

  return {
    provider,
    name: providerMeta.name,
    icon: providerMeta.icon,
    categories: profileCategories,
    coverage,
  }
}

export const providerProfiles: ProviderProfile[] = providers.map((p) => buildProviderProfile(p.id))
