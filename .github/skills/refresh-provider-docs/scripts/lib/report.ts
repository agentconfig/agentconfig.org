import type { Finding, FindingStatus } from './schema.ts'
import type { CompareResult } from './compare.ts'

const STATUS_ORDER: FindingStatus[] = ['ambiguous', 'changed', 'unsupported', 'confirmed']

const STATUS_HEADING: Record<FindingStatus, string> = {
  ambiguous: 'Ambiguous — needs a human decision',
  changed: 'Changed — documentation and the site disagree',
  unsupported: 'Unsupported — documentation states the capability is unavailable',
  confirmed: 'Confirmed — the site matches the primary source',
}

const STATUS_NOTE: Record<FindingStatus, string> = {
  ambiguous:
    'This skill will not resolve these automatically. Evidence-backed rows need a person to read the cited source, while site-contradiction rows need a person to pick the canonical site value before any source comparison can run.',
  changed: 'Each row is a concrete edit to make in the site data, or a gap in what the site models today.',
  unsupported: 'Publishing a capability claim for these rows would be inaccurate.',
  confirmed: 'No action needed. These rows are evidence that the published claim is still correct.',
}

/**
 * Documented values carry paths such as `.cursor/rules/*.mdc` and `<name>`.
 * Without escaping, Markdown renders the globs as emphasis and the angle
 * brackets as HTML, silently deleting characters from the very paths the
 * report exists to report accurately. This applies to prose detail as much as
 * to table cells.
 */
function escapeInline(value: string): string {
  return value.replace(/\n+/g, ' ').replace(/[\\`*_[\]<>&|]/g, (character) => `\\${character}`)
}

function escapeCell(value: string | null): string {
  if (value === null || value === '') return '—'
  return escapeInline(value)
}

function findingRow(finding: Finding): string {
  const cells = [
    escapeCell(finding.provider),
    escapeCell(finding.primitive),
    escapeCell(finding.aspect),
    escapeCell(finding.siteValue),
    escapeCell(finding.documentedValue),
    escapeCell(finding.action),
    finding.sourceUrl ? `[${finding.sourceAuthority}](${finding.sourceUrl}) ${finding.retrievedAt ?? ''}`.trim() : '—',
  ]
  return `| ${cells.join(' | ')} |`
}

export interface ReportOptions {
  generatedAt?: string
  registryVersion?: number
  claimCount?: number
}

/** Render an evidence report a reviewer can act on without rerunning anything. */
export function renderReport(result: CompareResult, options: ReportOptions = {}): string {
  const generatedAt = options.generatedAt ?? new Date().toISOString()
  const lines: string[] = []

  lines.push('# Provider documentation refresh')
  lines.push('')
  lines.push(`Generated ${generatedAt} from ${options.claimCount ?? result.findings.length} normalized claims against registry version ${options.registryVersion ?? 'unknown'}.`)
  lines.push('')
  lines.push(
    'Confirmed and changed rows rest on a registered primary source and cite it with the date it was retrieved. Ambiguous rows are unresolved because evidence validation failed, official sources disagree, or the site already contradicts itself on that key; site-contradiction rows have no citation because no source comparison was attempted. No row is published on evidence weaker than a registered primary source.',
  )
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  lines.push('| Status | Count | Meaning |')
  lines.push('| --- | --- | --- |')
  for (const status of STATUS_ORDER) {
    lines.push(`| ${status} | ${result.counts[status]} | ${STATUS_HEADING[status]} |`)
  }
  lines.push('')
  lines.push(`Site assertions this run did not verify: ${result.unverifiedSiteEntries}. These are published claims that no retrieved source spoke to, so they remain unproven rather than confirmed.`)
  lines.push('')

  for (const status of STATUS_ORDER) {
    const rows = result.findings.filter((finding) => finding.status === status)
    if (rows.length === 0) continue
    lines.push(`## ${STATUS_HEADING[status]}`)
    lines.push('')
    lines.push(STATUS_NOTE[status])
    lines.push('')
    lines.push('| Provider | Primitive | Aspect | Site says | Documentation says | Action | Source |')
    lines.push('| --- | --- | --- | --- | --- | --- | --- |')
    for (const finding of rows) lines.push(findingRow(finding))
    lines.push('')
    for (const finding of rows) {
      const qualifier = finding.notes ? ` Qualifier from the source: ${escapeInline(finding.notes)}` : ''
      lines.push(`- \`${finding.claimId}\`: ${escapeInline(finding.detail)}${qualifier}`)
    }
    lines.push('')
  }

  if (result.findings.length === 0) {
    lines.push('No claims were compared. Treat this as a failed retrieval rather than a clean run.')
    lines.push('')
  }

  lines.push('## How to act on this report')
  lines.push('')
  lines.push('1. Resolve every ambiguous row first; they block any confident edit.')
  lines.push('2. Apply `update-site-data` rows to `site/src/data/primitives.ts` only — `comparison.ts` and `providerProfiles.ts` derive from it automatically and should not be hand-edited.')
  lines.push('3. Treat `extend-site-model` rows as content design work, not a data edit.')
  lines.push('4. Re-run the comparison before opening a pull request so the report reflects the edits.')
  lines.push('')

  return lines.join('\n')
}
