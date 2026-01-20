import type { VNode } from 'preact'
import { ComparisonTable } from './ComparisonTable'

export function ProviderComparisonSection(): VNode {
  return (
    <div>
      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">Support levels:</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
            ✓ Full Support
          </span>
          <span className="text-muted-foreground">— First-class feature</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
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
