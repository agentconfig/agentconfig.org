import type { VNode } from 'preact'

interface ScopeRow {
  scope: string
  location: string
  visibility: string
}

const claudeCodeScopes: ScopeRow[] = [
  { scope: 'Local (default)', location: '~/.claude.json (per-project path)', visibility: 'You only (1 project)' },
  { scope: 'Project', location: '.mcp.json (project root)', visibility: 'Team (shared)' },
  { scope: 'User', location: '~/.claude.json (global section)', visibility: 'You only (all projects)' },
]

const vsCodeScopes: ScopeRow[] = [
  { scope: 'Workspace', location: '.vscode/mcp.json', visibility: 'Team (shared)' },
  { scope: 'User Profile', location: '(VS Code profile)', visibility: 'You only (profile)' },
  { scope: 'Dev Container', location: 'devcontainer.json customizations.vscode', visibility: 'Container (shared)' },
]

interface ScopesTableProps {
  provider: 'claude' | 'vscode'
}

export function ScopesTable({ provider }: ScopesTableProps): VNode {
  const scopes = provider === 'claude' ? claudeCodeScopes : vsCodeScopes

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
