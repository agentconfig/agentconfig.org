import { type ReactNode } from 'react'
import { ComparisonTable } from './ComparisonTable'

export function ProviderComparisonSection(): ReactNode {
  return (
    <div>
      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">Support levels:</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            ✓ Full Support
          </span>
          <span className="text-muted-foreground">— First-class feature</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
            ◐ Partial
          </span>
          <span className="text-muted-foreground">— Possible with workarounds</span>
        </span>
      </div>

      {/* Table */}
      <ComparisonTable />

      {/* Note */}
      <p className="mt-6 text-sm text-muted-foreground">
        Click any row to see implementation details and file locations for each provider.
      </p>
    </div>
  )
}
