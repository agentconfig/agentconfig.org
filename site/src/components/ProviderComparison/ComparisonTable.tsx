import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { ChevronDown, Copy, Check } from 'lucide-preact'
import { cn } from '@/lib/utils'
import {
  comparisonData,
  supportLevelLabels,
  supportLevelColors,
  supportLevelIcons,
  type ComparisonRow,
  type SupportLevel,
} from '@/data/comparison'

function SupportBadge({ level }: { level: SupportLevel }): VNode {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        supportLevelColors[level]
      )}
    >
      <span aria-hidden="true">{supportLevelIcons[level]}</span>
      {supportLevelLabels[level]}
    </span>
  )
}

interface ExpandedRowProps {
  row: ComparisonRow
}

function ExpandedRow({ row }: ExpandedRowProps): VNode {
  const [copiedLocation, setCopiedLocation] = useState<'copilot' | 'claude' | 'cursor' | null>(null)

  const handleCopy = async (provider: 'copilot' | 'claude' | 'cursor', location: string) => {
    try {
      await navigator.clipboard.writeText(location)
      setCopiedLocation(provider)
      setTimeout(() => { setCopiedLocation(null) }, 2000)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <tr className="bg-secondary/30">
      <td colSpan={4} className="px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Copilot details */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">GitHub Copilot</h4>
            <p className="text-sm text-muted-foreground">{row.copilot.implementation}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background px-2 py-1.5 rounded font-mono text-foreground border border-border">
                {row.copilot.location}
              </code>
              <button
                onClick={() => { void handleCopy('copilot', row.copilot.location) }}
                className={cn(
                  'p-1.5 rounded-md transition-colors shrink-0',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  copiedLocation === 'copilot'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-background border border-border hover:bg-secondary text-muted-foreground'
                )}
                aria-label={copiedLocation === 'copilot' ? 'Copied!' : 'Copy location'}
              >
                {copiedLocation === 'copilot' ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Claude details */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Claude Code</h4>
            <p className="text-sm text-muted-foreground">{row.claude.implementation}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background px-2 py-1.5 rounded font-mono text-foreground border border-border">
                {row.claude.location}
              </code>
              <button
                onClick={() => { void handleCopy('claude', row.claude.location) }}
                className={cn(
                  'p-1.5 rounded-md transition-colors shrink-0',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  copiedLocation === 'claude'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-background border border-border hover:bg-secondary text-muted-foreground'
                )}
                aria-label={copiedLocation === 'claude' ? 'Copied!' : 'Copy location'}
              >
                {copiedLocation === 'claude' ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Cursor details */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Cursor</h4>
            <p className="text-sm text-muted-foreground">{row.cursor.implementation}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background px-2 py-1.5 rounded font-mono text-foreground border border-border">
                {row.cursor.location}
              </code>
              <button
                onClick={() => { void handleCopy('cursor', row.cursor.location) }}
                className={cn(
                  'p-1.5 rounded-md transition-colors shrink-0',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  copiedLocation === 'cursor'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-background border border-border hover:bg-secondary text-muted-foreground'
                )}
                aria-label={copiedLocation === 'cursor' ? 'Copied!' : 'Copy location'}
              >
                {copiedLocation === 'cursor' ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}

export function ComparisonTable(): VNode {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (primitiveId: string) => {
    setExpandedRow(expandedRow === primitiveId ? null : primitiveId)
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Primitive
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">🤖</span>
                  GitHub Copilot
                </span>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">🧠</span>
                  Claude Code
                </span>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">✨</span>
                  Cursor
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {comparisonData.map((row) => (
              <>
                <tr
                  key={row.primitiveId}
                  className={cn(
                    'cursor-pointer transition-colors',
                    'hover:bg-secondary/30',
                    expandedRow === row.primitiveId && 'bg-secondary/20'
                  )}
                  onClick={() => { toggleRow(row.primitiveId) }}
                >
                  <td className="px-4 py-3">
                    <button
                      className="flex items-center gap-2 text-left w-full focus:outline-none"
                      aria-expanded={expandedRow === row.primitiveId}
                    >
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-muted-foreground shrink-0 transition-transform',
                          expandedRow === row.primitiveId && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {row.primitiveName}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SupportBadge level={row.copilot.level} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SupportBadge level={row.claude.level} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SupportBadge level={row.cursor.level} />
                  </td>
                </tr>
                {expandedRow === row.primitiveId && (
                  <ExpandedRow key={`${row.primitiveId}-expanded`} row={row} />
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
