import type { VNode } from 'preact'

interface FeatureRow {
  feature: string
  claudeCode: string
  vsCodeCopilot: string
}

const features: FeatureRow[] = [
  { feature: 'Transports', claudeCode: 'stdio, http, sse', vsCodeCopilot: 'stdio, http, sse' },
  { feature: 'Tools', claudeCode: '✓', vsCodeCopilot: '✓' },
  { feature: 'Resources', claudeCode: '✓', vsCodeCopilot: '✓' },
  { feature: 'Prompts', claudeCode: '✓ (/mcp)', vsCodeCopilot: '✓ (/mcp.*)' },
  { feature: 'Configuration', claudeCode: 'CLI + JSON', vsCodeCopilot: 'JSON + UI' },
  { feature: 'Server Discovery', claudeCode: 'Manual', vsCodeCopilot: 'Gallery + Auto' },
  { feature: 'Tool Search', claudeCode: '✓ (auto 10%+)', vsCodeCopilot: 'Via tool picker' },
  { feature: 'Enterprise Control', claudeCode: 'managed-mcp.json', vsCodeCopilot: 'Settings + MDM' },
]

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
            {features.map((row) => (
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
