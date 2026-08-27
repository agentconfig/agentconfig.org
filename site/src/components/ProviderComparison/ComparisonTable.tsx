import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { ChevronDown, Copy, Check, ExternalLink } from 'lucide-preact'
import { cn } from '@/lib/utils'
import {
  comparisonData,
  getProviderSupport,
  supportLevelLabels,
  supportLevelColors,
  supportLevelIcons,
  type ComparisonRow,
  type SupportLevel,
} from '@/data/comparison'
import { providers } from '@/data/providers'
import type { Provider } from '@/data/primitives'
import { useSelectedProvider } from '@/components/Navigation/useSelectedProvider'

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
  const [copiedLocation, setCopiedLocation] = useState<Provider | null>(null)
  const selectedProvider = useSelectedProvider()
  const visibleProviders = selectedProvider === ''
    ? providers
    : providers.filter((provider) => provider.id === selectedProvider)

  const handleCopy = async (provider: Provider, location: string) => {
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
      <td colSpan={providers.length + 1} className="px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {visibleProviders.map((provider) => {
            const support = getProviderSupport(row, provider.id)
            return (
              <div key={provider.id} className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-foreground">{provider.name}</h4>
                <p className="text-sm text-muted-foreground flex-1">{support.implementation}</p>
                {support.sourceUrl != null && (
                  <a
                    href={support.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Provider documentation
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
                <div className="flex items-center gap-2 mt-auto">
                  <code className="flex-1 text-xs bg-background px-2 py-1.5 rounded font-mono text-foreground border border-border">
                    {support.location}
                  </code>
                  <button
                    onClick={() => { void handleCopy(provider.id, support.location) }}
                    className={cn(
                      'p-1.5 rounded-md transition-colors shrink-0',
                      'focus:outline-none focus:ring-2 focus:ring-ring',
                      copiedLocation === provider.id
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                        : 'bg-background border border-border hover:bg-secondary text-muted-foreground'
                    )}
                    aria-label={copiedLocation === provider.id ? 'Copied!' : 'Copy location'}
                  >
                    {copiedLocation === provider.id ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </td>
    </tr>
  )
}

export function ComparisonTable(): VNode {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const selectedProvider = useSelectedProvider()

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
              {providers.map((provider) => (
                <th
                  key={provider.id}
                  className={cn(
                    'px-4 py-3 text-center text-sm font-semibold text-foreground',
                    selectedProvider === provider.id && 'bg-primary/10'
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true">{provider.icon}</span>
                    {provider.name}
                  </span>
                </th>
              ))}
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
                  {providers.map((provider) => (
                    <td
                      key={provider.id}
                      className={cn(
                        'px-4 py-3 text-center',
                        selectedProvider === provider.id && 'bg-primary/5'
                      )}
                    >
                      <SupportBadge level={getProviderSupport(row, provider.id).level} />
                    </td>
                  ))}
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
