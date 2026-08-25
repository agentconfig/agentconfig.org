import {
  canonicalize,
  displayValue,
  SITE_FIELD_BY_ASPECT,
  type Claim,
  type Finding,
  type FindingAction,
  type FindingStatus,
} from './schema.ts'
import type { LoadedRegistry } from './registry.ts'
import type { SiteIndex } from './siteData.ts'

export interface CompareOptions {
  now?: Date
  maxSourceAgeDays?: number
}

export interface CompareResult {
  findings: Finding[]
  counts: Record<FindingStatus, number>
  /** Site assertions no claim in this run spoke to. */
  unverifiedSiteEntries: number
  needsAction: boolean
}

function claimKey(claim: Claim): string {
  return `${claim.provider}|${claim.primitive}|${claim.aspect}`
}

function ageInDays(retrievedAt: string, now: Date): number {
  const retrieved = new Date(retrievedAt.length === 10 ? `${retrievedAt}T00:00:00Z` : retrievedAt)
  if (Number.isNaN(retrieved.getTime())) return Number.POSITIVE_INFINITY
  return (now.getTime() - retrieved.getTime()) / 86_400_000
}

/**
 * Registry entries are canonical page URLs. A claim may cite the markdown
 * variant or a fragment on the same page, but never a different page: allowing
 * arbitrary descendants would let a claim about one page pass as evidence for
 * another and slip past the URL-mismatch fail-closed path.
 */
function sourceUrlMatchesRegistry(claimUrl: string, registryUrl: string): boolean {
  const base = registryUrl.replace(/\/$/, '')
  const candidate = claimUrl.replace(/\/$/, '')
  return candidate === base || candidate === `${base}.md` || candidate.startsWith(`${base}#`) || candidate.startsWith(`${base}.md#`)
}

function makeFinding(
  claim: Claim,
  status: FindingStatus,
  action: FindingAction,
  detail: string,
  siteValue: string | null,
): Finding {
  return {
    claimId: claim.id,
    provider: claim.provider,
    primitive: claim.primitive,
    aspect: claim.aspect,
    status,
    action,
    siteValue,
    documentedValue: displayValue(claim.value),
    sourceUrl: claim.sourceUrl,
    sourceAuthority: claim.sourceAuthority,
    retrievedAt: claim.retrievedAt,
    detail,
  }
}

/**
 * Compare normalized documentation claims against what the site publishes.
 *
 * The comparison never rewrites prose and never picks a winner between
 * conflicting official sources. Anything it cannot settle deterministically
 * becomes an `ambiguous` finding for a human.
 */
export function compareClaims(
  claims: Claim[],
  site: SiteIndex,
  loaded: LoadedRegistry,
  options: CompareOptions = {},
): CompareResult {
  const now = options.now ?? new Date()
  const maxAge = options.maxSourceAgeDays ?? loaded.registry.maxSourceAgeDays
  const findings: Finding[] = []
  const answeredSiteKeys = new Set<string>()

  const groups = new Map<string, Claim[]>()
  for (const claim of claims) {
    const key = claimKey(claim)
    const group = groups.get(key)
    if (group) group.push(claim)
    else groups.set(key, [claim])
  }

  for (const [key, group] of groups) {
    const distinctValues = new Set(group.map((claim) => canonicalize(claim.value, claim.aspect)))
    const representative = group.find((claim) => claim.sourceAuthority === 'primary') ?? group[0]!

    if (distinctValues.size > 1) {
      const citations = group.map((claim) => `${displayValue(claim.value)} (${claim.sourceUrl})`).join(' vs ')
      findings.push(
        makeFinding(
          representative,
          'ambiguous',
          'human-review',
          `Official sources disagree and this skill will not choose between them: ${citations}`,
          null,
        ),
      )
      continue
    }

    if (!group.some((claim) => claim.sourceAuthority === 'primary')) {
      findings.push(
        makeFinding(
          representative,
          'ambiguous',
          'human-review',
          'Only secondary sources support this claim; a primary source is required before publishing it.',
          null,
        ),
      )
      continue
    }

    const registered = loaded.sourceById.get(representative.sourceId)
    if (!registered) {
      findings.push(
        makeFinding(
          representative,
          'ambiguous',
          'human-review',
          `Source "${representative.sourceId}" is not in the registry, so its authority cannot be established.`,
          null,
        ),
      )
      continue
    }

    if (registered.provider !== representative.provider) {
      findings.push(
        makeFinding(
          representative,
          'ambiguous',
          'human-review',
          `Source "${representative.sourceId}" belongs to provider "${registered.provider}" but the claim is about "${representative.provider}".`,
          null,
        ),
      )
      continue
    }

    if (!sourceUrlMatchesRegistry(representative.sourceUrl, registered.url)) {
      findings.push(
        makeFinding(
          representative,
          'ambiguous',
          'human-review',
          `Claim URL ${representative.sourceUrl} does not match registered source URL ${registered.url}.`,
          null,
        ),
      )
      continue
    }

    const age = ageInDays(representative.retrievedAt, now)
    if (age > maxAge) {
      findings.push(
        makeFinding(
          representative,
          'ambiguous',
          'human-review',
          `Evidence was retrieved ${Math.round(age)} days ago, beyond the ${maxAge}-day freshness limit; retrieve it again before publishing.`,
          null,
        ),
      )
      continue
    }

    const siteField = SITE_FIELD_BY_ASPECT[representative.aspect]
    if (!siteField) {
      findings.push(
        makeFinding(
          representative,
          'changed',
          'extend-site-model',
          `The site publishes no field for the "${representative.aspect}" aspect, so this documented behavior is currently invisible to readers.`,
          null,
        ),
      )
      continue
    }

    const siteEntries = site.entries.filter(
      (entry) => entry.provider === representative.provider && entry.primitive === representative.primitive && entry.aspect === representative.aspect,
    )

    const documented = canonicalize(representative.value, representative.aspect)
    const documentsNoSupport = representative.aspect === 'support' && documented === 'none'

    if (siteEntries.length === 0) {
      const providerIsPublished = site.providers.includes(representative.provider)
      const primitiveIsPublished = site.primitives.includes(representative.primitive)
      if (documentsNoSupport) {
        findings.push(
          makeFinding(representative, 'unsupported', 'none', 'Provider documentation states this is not supported, and the site makes no claim to the contrary.', null),
        )
      } else if (!primitiveIsPublished) {
        findings.push(
          makeFinding(
            representative,
            'changed',
            'extend-site-model',
            `The site has no "${representative.primitive}" primitive, so this documented capability cannot be expressed today.`,
            null,
          ),
        )
      } else if (!providerIsPublished) {
        findings.push(
          makeFinding(
            representative,
            'changed',
            'extend-site-model',
            `The site does not publish "${representative.provider}" yet, so this documented behavior has no home in the comparison.`,
            null,
          ),
        )
      } else {
        findings.push(
          makeFinding(
            representative,
            'changed',
            'update-site-data',
            `The site publishes no "${representative.aspect}" value for ${representative.provider} and "${representative.primitive}".`,
            null,
          ),
        )
      }
      continue
    }

    for (const entry of siteEntries) answeredSiteKeys.add(`${entry.origin}|${entry.provider}|${entry.primitive}|${entry.aspect}`)

    const siteValues = new Set(siteEntries.map((entry) => canonicalize(entry.value, entry.aspect)))
    if (siteValues.size > 1) {
      const detail = siteEntries.map((entry) => `${entry.origin}: ${entry.value}`).join(' vs ')
      findings.push(
        makeFinding(
          representative,
          'ambiguous',
          'human-review',
          `The site contradicts itself before any comparison can be made (${detail}).`,
          siteEntries.map((entry) => entry.value).join(' | '),
        ),
      )
      continue
    }

    const siteValue = siteEntries[0]!.value
    const matches = canonicalize(siteValue, representative.aspect) === documented

    if (documentsNoSupport) {
      findings.push(
        makeFinding(
          representative,
          'unsupported',
          matches ? 'none' : 'update-site-data',
          matches
            ? 'Provider documentation and the site agree that this is not supported.'
            : `Provider documentation states this is not supported, but the site publishes "${siteValue}".`,
          siteValue,
        ),
      )
      continue
    }

    findings.push(
      makeFinding(
        representative,
        matches ? 'confirmed' : 'changed',
        matches ? 'none' : 'update-site-data',
        matches
          ? 'Published value matches the primary source.'
          : `Primary source says "${displayValue(representative.value)}" but the site publishes "${siteValue}".`,
        siteValue,
      ),
    )
  }

  findings.sort((a, b) => a.claimId.localeCompare(b.claimId))

  const counts: Record<FindingStatus, number> = { confirmed: 0, changed: 0, ambiguous: 0, unsupported: 0 }
  for (const finding of findings) counts[finding.status] += 1

  const unverifiedSiteEntries = site.entries.filter(
    (entry) => !answeredSiteKeys.has(`${entry.origin}|${entry.provider}|${entry.primitive}|${entry.aspect}`),
  ).length

  return {
    findings,
    counts,
    unverifiedSiteEntries,
    needsAction: counts.changed > 0 || counts.ambiguous > 0,
  }
}
