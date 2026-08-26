import { primitives, type Provider, type SupportLevel as PrimitiveSupportLevel } from './primitives'

/**
 * Support level for the provider comparison table. Kept in sync with
 * primitives.ts's ProviderImplementation.support so both consumers stay
 * on one typed vocabulary.
 */
export type SupportLevel = PrimitiveSupportLevel

export interface ProviderSupport {
  /** Support level */
  level: SupportLevel
  /** How it's implemented */
  implementation: string
  /** File location or feature name */
  location: string
  /** Primary provider documentation */
  sourceUrl?: string
}

export interface ComparisonRow {
  /** Primitive ID (matches primitives.ts) */
  primitiveId: string
  /** Primitive display name */
  primitiveName: string
  /** GitHub Copilot implementation */
  copilot: ProviderSupport
  /** Claude Code implementation */
  claude: ProviderSupport
  /** Cursor implementation */
  cursor: ProviderSupport
  /** OpenAI Codex implementation */
  codex: ProviderSupport
}

function buildProviderSupport(primitiveId: string, provider: Provider): ProviderSupport {
  const primitive = primitives.find((p) => p.id === primitiveId)
  const impl = primitive?.implementations.find((i) => i.provider === provider)
  if (primitive == null || impl == null) {
    throw new Error(`Missing "${provider}" implementation for primitive "${primitiveId}" in primitives.ts`)
  }
  return {
    level: impl.support,
    implementation: impl.implementation,
    location: impl.location,
    ...(impl.sourceUrl != null ? { sourceUrl: impl.sourceUrl } : {}),
  }
}

/**
 * The homepage provider-comparison table. Derived directly from
 * primitives.ts rather than hand-duplicated, so the two views of the same
 * data can never drift apart (see PR #42 review history for the class of
 * bug this prevents).
 */
export const comparisonData: ComparisonRow[] = primitives.map((primitive) => ({
  primitiveId: primitive.id,
  primitiveName: primitive.name,
  copilot: buildProviderSupport(primitive.id, 'copilot'),
  claude: buildProviderSupport(primitive.id, 'claude'),
  cursor: buildProviderSupport(primitive.id, 'cursor'),
  codex: buildProviderSupport(primitive.id, 'codex'),
}))

export const supportLevelLabels: Record<SupportLevel, string> = {
  full: 'Full Support',
  partial: 'Partial',
  diy: 'DIY / Manual',
}

export const supportLevelColors: Record<SupportLevel, string> = {
  full: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  partial: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  diy: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-200',
}

export const supportLevelIcons: Record<SupportLevel, string> = {
  full: '✓',
  partial: '◐',
  diy: '—',
}

export function getProviderSupport(row: ComparisonRow, providerId: Provider): ProviderSupport {
  return row[providerId]
}
