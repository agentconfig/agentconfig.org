import type { VNode } from 'preact'
import { scopeModel } from '@/data/primitives'

export function ScopeModelSection(): VNode {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Scopes are not peer primitives. They are where a primitive applies. A common pattern is to keep shared guidance in a root <code>AGENTS.md</code> and layer directory-level <code>AGENTS.md</code> files where constraints differ.
      </p>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Scope</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Common usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scopeModel.map((scope) => (
                <tr key={scope.id}>
                  <td className="px-4 py-3 align-top">
                    <span className="font-medium text-foreground">{scope.name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{scope.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
