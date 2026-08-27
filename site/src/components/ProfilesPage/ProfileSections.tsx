import type { VNode } from 'preact'
import { ExternalLink } from 'lucide-preact'
import { cn } from '@/lib/utils'
import type { ProfileCategory, ProviderProfile } from '@/data/providerProfiles'
import { supportLevelColors, supportLevelIcons, supportLevelLabels } from '@/data/comparison'
import type { SupportLevel } from '@/data/primitives'

export function SupportBadge({ level }: { level: SupportLevel }): VNode {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
        supportLevelColors[level]
      )}
    >
      <span aria-hidden="true">{supportLevelIcons[level]}</span>
      {supportLevelLabels[level]}
    </span>
  )
}

export function CoverageSummary({ profile }: { profile: ProviderProfile }): VNode {
  const { coverage } = profile
  return (
    <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
      <span>
        <strong className="text-foreground">{coverage.total}</strong> primitives tracked
      </span>
      <span>
        <strong className="text-foreground">{coverage.full}</strong> full support
      </span>
      {coverage.partial > 0 && (
        <span>
          <strong className="text-foreground">{coverage.partial}</strong> partial
        </span>
      )}
      {coverage.diy > 0 && (
        <span>
          <strong className="text-foreground">{coverage.diy}</strong> DIY / manual
        </span>
      )}
      <span>
        <strong className="text-foreground">{coverage.cited}</strong> of {coverage.total} cited to provider documentation
      </span>
    </div>
  )
}

export function CategorySection({ category }: { category: ProfileCategory }): VNode {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-foreground">{category.name}</h2>
      <div className="md:overflow-hidden md:rounded-xl md:border md:border-border">
          <table role="table" className="block w-full text-sm md:table">
            <thead role="rowgroup" className="hidden md:table-header-group">
              <tr role="row" className="bg-secondary/50">
                <th role="columnheader" className="px-4 py-2 text-left font-semibold text-foreground">Primitive</th>
                <th role="columnheader" className="px-4 py-2 text-left font-semibold text-foreground">Support</th>
                <th role="columnheader" className="px-4 py-2 text-left font-semibold text-foreground">Implementation</th>
                <th role="columnheader" className="px-4 py-2 text-left font-semibold text-foreground">Location</th>
                <th role="columnheader" className="px-4 py-2 text-left font-semibold text-foreground">Source</th>
              </tr>
            </thead>
            <tbody role="rowgroup" className="grid gap-3 md:table-row-group md:divide-y md:divide-border">
              {category.entries.map((entry) => (
                <tr role="row" key={entry.id} className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-background/60 p-4 align-top hover:bg-muted/30 md:table-row md:border-0 md:bg-transparent md:p-0">
                  <td role="cell" className="col-span-2 font-medium text-foreground md:px-4 md:py-3 md:whitespace-nowrap">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground md:hidden">Primitive</span>
                    {entry.name}
                  </td>
                  <td role="cell" className="col-span-2 md:table-cell md:px-4 md:py-3">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground md:hidden">Support</span>
                    <SupportBadge level={entry.support} />
                  </td>
                  <td role="cell" className="col-span-2 text-muted-foreground md:table-cell md:px-4 md:py-3">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground md:hidden">Implementation</span>
                    {entry.implementation}
                  </td>
                  <td role="cell" className="col-span-2 min-w-0 md:table-cell md:px-4 md:py-3">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground md:hidden">Location</span>
                    <code className="block max-w-full break-words rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground">
                      {entry.location}
                    </code>
                  </td>
                  <td role="cell" className="col-span-2 md:table-cell md:px-4 md:py-3">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground md:hidden">Source</span>
                    {entry.sourceUrl != null ? (
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Docs
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  )
}
