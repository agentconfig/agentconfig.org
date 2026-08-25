/**
 * Schemas and validators for provider documentation refresh.
 *
 * Everything in this module is deterministic and dependency-free. Agent
 * judgment produces claims; this module decides whether those claims are
 * well-formed enough to be compared against published site data.
 */

export const TOPICS = [
  'instructions',
  'skills',
  'mcp',
  'hooks',
  'custom-agents',
  'permissions',
  'memory',
  'precedence',
  'cli',
  'cloud-agent',
  'standard',
] as const

export const ASPECTS = [
  'artifact',
  'location',
  'scope',
  'precedence',
  'lifecycle-events',
  'permissions',
  'sandbox',
  'surfaces',
  'minimum-version',
  'support',
] as const

/**
 * Aspects whose values carry meaning in the order the provider documents them.
 * Sorting these would let two genuinely conflicting official claims, such as
 * two different precedence orders, canonicalize to the same string and escape
 * the ambiguous fail-closed path.
 */
export const ORDERED_ASPECTS = ['precedence'] as const

export const AUTHORITIES = ['primary', 'secondary'] as const
export const SUPPORT_LEVELS = ['full', 'partial', 'diy', 'none'] as const
export const COVERAGE_LEVELS = ['tracked', 'candidate'] as const
export const FINDING_STATUSES = ['confirmed', 'changed', 'ambiguous', 'unsupported'] as const
export const FINDING_ACTIONS = ['none', 'update-site-data', 'extend-site-model', 'human-review'] as const

export type Topic = (typeof TOPICS)[number]
export type Aspect = (typeof ASPECTS)[number]
export type Authority = (typeof AUTHORITIES)[number]
export type SupportLevel = (typeof SUPPORT_LEVELS)[number]
export type Coverage = (typeof COVERAGE_LEVELS)[number]
export type FindingStatus = (typeof FINDING_STATUSES)[number]
export type FindingAction = (typeof FINDING_ACTIONS)[number]

/**
 * Aspects that map onto a field the site already publishes. Every other aspect
 * is real documentation the site does not model yet.
 */
export const SITE_FIELD_BY_ASPECT: Partial<Record<Aspect, 'implementation' | 'location' | 'support'>> = {
  artifact: 'implementation',
  location: 'location',
  support: 'support',
}

export interface RegistrySource {
  id: string
  topic: Topic
  url: string
  authority: Authority
  note?: string
}

export interface RegistryProvider {
  id: string
  name: string
  coverage: Coverage
  index?: { url: string; kind: 'llms-txt' | 'api' | 'repository' }
  retrieval?: Record<string, string>
  sources: RegistrySource[]
}

export interface Registry {
  version: number
  maxSourceAgeDays: number
  providers: RegistryProvider[]
}

export interface Claim {
  id: string
  provider: string
  primitive: string
  aspect: Aspect
  value: string | string[]
  sourceId: string
  sourceUrl: string
  sourceAuthority: Authority
  retrievedAt: string
  notes?: string
}

export interface Finding {
  claimId: string
  provider: string
  primitive: string
  aspect: Aspect
  status: FindingStatus
  action: FindingAction
  siteValue: string | null
  documentedValue: string | null
  sourceUrl: string | null
  sourceAuthority: Authority | null
  retrievedAt: string | null
  detail: string
}

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: string[] }

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}))?$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireString(record: Record<string, unknown>, key: string, where: string, errors: string[]): string {
  const value = record[key]
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${where}: "${key}" must be a non-empty string`)
    return ''
  }
  return value
}

function requireEnum<T extends string>(
  record: Record<string, unknown>,
  key: string,
  allowed: readonly T[],
  where: string,
  errors: string[],
): T | undefined {
  const value = record[key]
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    errors.push(`${where}: "${key}" must be one of ${allowed.join(', ')}`)
    return undefined
  }
  return value as T
}

function requireHttpsUrl(record: Record<string, unknown>, key: string, where: string, errors: string[]): string {
  const value = requireString(record, key, where, errors)
  if (value === '') return ''
  if (!value.startsWith('https://')) {
    errors.push(`${where}: "${key}" must be an https URL, got "${value}"`)
  }
  return value
}

export function validateRegistry(input: unknown): ValidationResult<Registry> {
  const errors: string[] = []
  if (!isRecord(input)) return { ok: false, errors: ['registry: expected an object'] }

  if (typeof input.version !== 'number') errors.push('registry: "version" must be a number')
  if (typeof input.maxSourceAgeDays !== 'number' || input.maxSourceAgeDays <= 0) {
    errors.push('registry: "maxSourceAgeDays" must be a positive number')
  }
  if (!Array.isArray(input.providers) || input.providers.length === 0) {
    errors.push('registry: "providers" must be a non-empty array')
    return { ok: false, errors }
  }

  const seenSourceIds = new Set<string>()
  const seenProviderIds = new Set<string>()

  for (const rawProvider of input.providers) {
    if (!isRecord(rawProvider)) {
      errors.push('registry: each provider must be an object')
      continue
    }
    const providerId = requireString(rawProvider, 'id', 'provider', errors)
    const where = `provider "${providerId || '?'}"`
    requireString(rawProvider, 'name', where, errors)
    const coverage = requireEnum(rawProvider, 'coverage', COVERAGE_LEVELS, where, errors)

    if (providerId !== '') {
      if (seenProviderIds.has(providerId)) errors.push(`${where}: duplicate provider id`)
      seenProviderIds.add(providerId)
    }

    if (!Array.isArray(rawProvider.sources) || rawProvider.sources.length === 0) {
      errors.push(`${where}: "sources" must be a non-empty array`)
      continue
    }

    let primaryCount = 0
    for (const rawSource of rawProvider.sources) {
      if (!isRecord(rawSource)) {
        errors.push(`${where}: each source must be an object`)
        continue
      }
      const sourceId = requireString(rawSource, 'id', `${where} source`, errors)
      const sourceWhere = `source "${sourceId || '?'}"`
      requireEnum(rawSource, 'topic', TOPICS, sourceWhere, errors)
      requireHttpsUrl(rawSource, 'url', sourceWhere, errors)
      const authority = requireEnum(rawSource, 'authority', AUTHORITIES, sourceWhere, errors)
      if (authority === 'primary') primaryCount += 1
      if (authority === 'secondary' && (typeof rawSource.note !== 'string' || rawSource.note.trim() === '')) {
        errors.push(`${sourceWhere}: a secondary source must carry a non-empty "note" explaining why no primary source is used`)
      }
      if (sourceId !== '') {
        if (seenSourceIds.has(sourceId)) errors.push(`${sourceWhere}: duplicate source id`)
        seenSourceIds.add(sourceId)
        if (providerId !== '' && !sourceId.startsWith(`${providerId}.`)) {
          errors.push(`${sourceWhere}: source id must be namespaced as "${providerId}.<slug>"`)
        }
      }
    }

    if (coverage === 'tracked' && primaryCount === 0) {
      errors.push(`${where}: a tracked provider needs at least one primary source`)
    }
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as unknown as Registry }
}

export function validateClaims(input: unknown): ValidationResult<Claim[]> {
  const errors: string[] = []
  if (!Array.isArray(input)) {
    return { ok: false, errors: ['claims: expected an array of claim objects'] }
  }
  if (input.length === 0) {
    return { ok: false, errors: ['claims: expected at least one claim; an empty run is treated as a failed retrieval'] }
  }

  const claims: Claim[] = []
  input.forEach((rawClaim, index) => {
    if (!isRecord(rawClaim)) {
      errors.push(`claim[${index}]: expected an object`)
      return
    }
    const id = requireString(rawClaim, 'id', `claim[${index}]`, errors)
    const where = `claim "${id || index}"`
    requireString(rawClaim, 'provider', where, errors)
    requireString(rawClaim, 'primitive', where, errors)
    const aspect = requireEnum(rawClaim, 'aspect', ASPECTS, where, errors)
    requireString(rawClaim, 'sourceId', where, errors)
    requireHttpsUrl(rawClaim, 'sourceUrl', where, errors)
    requireEnum(rawClaim, 'sourceAuthority', AUTHORITIES, where, errors)

    const retrievedAt = requireString(rawClaim, 'retrievedAt', where, errors)
    if (retrievedAt !== '' && !ISO_DATE.test(retrievedAt)) {
      errors.push(`${where}: "retrievedAt" must be an ISO 8601 date, got "${retrievedAt}"`)
    }

    const value = rawClaim.value
    const valueIsString = typeof value === 'string' && value.trim() !== ''
    const valueIsList = Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.trim() !== '')
    if (!valueIsString && !valueIsList) {
      errors.push(`${where}: "value" must be a non-empty string or a non-empty array of strings`)
    }

    if (aspect === 'support' && typeof value === 'string' && !SUPPORT_LEVELS.includes(value as SupportLevel)) {
      errors.push(`${where}: a "support" claim must use one of ${SUPPORT_LEVELS.join(', ')}`)
    }

    if (errors.length === 0) claims.push(rawClaim as unknown as Claim)
  })

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: claims }
}

/**
 * Canonical comparison form. Formatting differences must not read as drift.
 *
 * Set-valued aspects are sorted so that listing order is not mistaken for a
 * change. Ordered aspects keep the documented sequence, because for those the
 * order is the claim.
 */
export function canonicalize(value: string | string[], aspect?: Aspect): string {
  const preserveOrder = aspect !== undefined && (ORDERED_ASPECTS as readonly string[]).includes(aspect)
  const parts = Array.isArray(value) ? value : [value]
  const normalized = parts
    .flatMap((part) => part.split(/\s*(?:,|\bor\b)\s*/i))
    .map((part) =>
      part
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[.;]+$/, '')
        .replace(/^[`'"]|[`'"]$/g, '')
        .toLowerCase(),
    )
    .filter((part) => part !== '')
  return (preserveOrder ? normalized : normalized.sort()).join(' | ')
}

export function displayValue(value: string | string[]): string {
  return Array.isArray(value) ? value.join(', ') : value
}
