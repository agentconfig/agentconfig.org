import type { VNode } from 'preact'
import { mcpFeatureComparison } from '@/data/mcpTutorial'

export function MCPFeatureTable(): VNode {
  return (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Feature</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Claude Code</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">VS Code/Copilot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mcpFeatureComparison.map((row) => (
              <tr key={row.feature} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{row.feature}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.claudeCode}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.vsCodeCopilot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
