import type { VNode } from 'preact'
import type { ProviderScope } from '@/data/primitives'

interface ScopesTableProps {
  scopes: readonly ProviderScope[]
}

export function ScopesTable({ scopes }: ScopesTableProps): VNode {
  return (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Scope</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Location</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scopes.map((row) => (
              <tr key={row.scope} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{row.scope}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{row.location}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.visibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
