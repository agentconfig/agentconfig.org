import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { ChevronDown, Copy, Check, ExternalLink, Shield, Wrench, FileText, GitBranch, Boxes, BookOpenCheck } from 'lucide-preact'
import { cn } from '@/lib/utils'
import { type Primitive, type Provider } from '@/data/primitives'
import { providers } from '@/data/providers'

export interface PrimitiveCardProps {
  /** The primitive to display */
  primitive: Primitive
  /** Additional CSS classes */
  className?: string | undefined
}

const categoryIcons = {
  instructions: FileText,
  procedures: BookOpenCheck,
  'tools-context': Wrench,
  delegation: GitBranch,
  'control-approval': Shield,
  'memory-state': Boxes,
  distribution: Boxes,
  'verification-observability': Shield,
}

const categoryColors = {
  instructions: 'text-blue-500 dark:text-blue-400',
  procedures: 'text-amber-500 dark:text-amber-400',
  'tools-context': 'text-emerald-500 dark:text-emerald-400',
  delegation: 'text-violet-500 dark:text-violet-400',
  'control-approval': 'text-rose-500 dark:text-rose-400',
  'memory-state': 'text-cyan-500 dark:text-cyan-400',
  distribution: 'text-indigo-500 dark:text-indigo-400',
  'verification-observability': 'text-orange-500 dark:text-orange-400',
}

const supportBadgeColors = {
  full: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  partial: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  diy: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-200',
}

const providerMap = Object.fromEntries(providers.map(p => [p.id, p]))

export function PrimitiveCard({ primitive, className }: PrimitiveCardProps): VNode {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedProvider, setCopiedProvider] = useState<Provider | null>(null)

  const CategoryIcon = categoryIcons[primitive.category]

  const handleCopyLocation = async (provider: Provider, location: string) => {
    try {
      await navigator.clipboard.writeText(location)
      setCopiedProvider(provider)
      setTimeout(() => { setCopiedProvider(null) }, 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card overflow-hidden',
        'transition-shadow duration-200',
        'hover:shadow-md',
        className
      )}
    >
      {/* Header - always visible */}
      <button
        onClick={() => { setIsExpanded(!isExpanded) }}
        className={cn(
          'w-full px-5 py-4 text-left',
          'flex items-start gap-4',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset',
          'transition-colors duration-150',
          'hover:bg-secondary/30'
        )}
        aria-expanded={isExpanded}
      >
        {/* Icon */}
        <div className={cn('mt-0.5', categoryColors[primitive.category])}>
          <CategoryIcon className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">
            {primitive.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {primitive.description}
          </p>
        </div>

        {/* Expand indicator */}
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground shrink-0 mt-0.5',
            'transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-border space-y-5">
          {/* What it is */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              What it is
            </h4>
            <p className="text-sm text-muted-foreground">
              {primitive.whatItIs}
            </p>
          </div>

          {/* Use when */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Use it when
            </h4>
            <ul className="space-y-1.5">
              {primitive.useWhen.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Prevents */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Prevents
            </h4>
            <p className="text-sm text-muted-foreground">
              {primitive.prevents}
            </p>
          </div>

          {/* Combine with */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Combine with
            </h4>
            <div className="flex flex-wrap gap-2">
              {primitive.combineWith.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Provider implementations */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Implementation by provider
            </h4>
            <div className="space-y-3">
              {primitive.implementations.map((impl) => (
                <div
                  key={impl.provider}
                  className="rounded-lg bg-secondary/50 p-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {providerMap[impl.provider]?.name ?? impl.provider}
                    </span>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        supportBadgeColors[impl.support]
                      )}
                    >
                      {impl.support === 'full' ? 'Full Support' : impl.support === 'partial' ? 'Partial' : 'DIY'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {impl.implementation}
                  </p>
                  {impl.sourceUrl != null && (
                    <a
                      href={impl.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Provider documentation
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-background px-2 py-1 rounded font-mono text-foreground">
                      {impl.location}
                    </code>
                    <button
                      onClick={() => { void handleCopyLocation(impl.provider, impl.location) }}
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-ring',
                        copiedProvider === impl.provider
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                          : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                      )}
                      aria-label={copiedProvider === impl.provider ? 'Copied!' : 'Copy location'}
                    >
                      {copiedProvider === impl.provider ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
