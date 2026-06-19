import { primitives, type Provider, type ProviderImplementation } from './primitives'

export type SupportLevel = 'full' | 'partial' | 'none'

export interface ProviderSupport {
  /** Support level */
  level: SupportLevel
  /** How it's implemented */
  implementation: string
  /** File location or feature name */
  location: string
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

/**
 * Comparison data is derived directly from primitives.ts
 * No mapping needed - support levels are already in the correct format
 */
function getProviderImplementation(
  implementations: ProviderImplementation[],
  provider: Provider
): ProviderSupport {
  const impl = implementations.find((i: ProviderImplementation) => i.provider === provider)
  if (impl) {
    return {
      level: impl.support as SupportLevel,
      implementation: impl.implementation,
      location: impl.location,
    }
  }
  return {
    level: 'none',
    implementation: 'Not available',
    location: 'N/A',
  }
}

/**
 * Derive comparison data from primitives source of truth
 */
function buildComparisonData(): ComparisonRow[] {
  return primitives.map(primitive => ({
    primitiveId: primitive.id,
    primitiveName: primitive.name,
    copilot: getProviderImplementation(primitive.implementations, 'copilot'),
    claude: getProviderImplementation(primitive.implementations, 'claude'),
    cursor: getProviderImplementation(primitive.implementations, 'cursor'),
    codex: getProviderImplementation(primitive.implementations, 'codex'),
  }))
}

export const comparisonData: ComparisonRow[] = buildComparisonData()

// ============================================================================
// LEGACY DATA - All hardcoded rows below have been replaced by buildComparisonData()
// Kept in comments for reference during transition. To be removed after validation.
// ============================================================================
/*

export const comparisonData: ComparisonRow[] = [
*/

export const supportLevelLabels: Record<SupportLevel, string> = {
  full: 'Full Support',
  partial: 'Partial',
  none: 'Not Available',
}

export const supportLevelColors: Record<SupportLevel, string> = {
  full: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  partial: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  none: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-200',
}

export const supportLevelIcons: Record<SupportLevel, string> = {
  full: '✓',
  partial: '◐',
  none: '—',
}

export function getProviderSupport(row: ComparisonRow, providerId: Provider): ProviderSupport {
  return row[providerId]
}
