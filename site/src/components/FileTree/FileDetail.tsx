import { useRef, useEffect } from 'preact/hooks'
import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { Copy, Check, FileCode, Clock, Layers } from 'lucide-preact'
import { cn } from '@/lib/utils'
import { type FileNode } from '@/data/fileTree'

export interface FileDetailProps {
  /** The file node to display details for */
  node: FileNode | null
  /** Additional CSS classes */
  className?: string | undefined
}

export function FileDetail({ node, className }: FileDetailProps): VNode {
  const containerRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  // Scroll into view when node changes
  useEffect(() => {
    if (node && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [node])

  const handleCopyExample = async () => {
    if (node?.details?.example) {
      try {
        await navigator.clipboard.writeText(node.details.example)
        setCopied(true)
        setTimeout(() => { setCopied(false) }, 2000)
      } catch {
        // Clipboard API not available
      }
    }
  }

  if (!node?.details) {
    return (
      <div
        className={cn(
          'rounded-xl border border-dashed border-border bg-card/50 p-8 text-center',
          className
        )}
      >
        <FileCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" aria-hidden="true" />
        <p className="text-muted-foreground">
          Click a file in the tree to see its details
        </p>
      </div>
    )
  }

  const { details } = node

  return (
    <div
      ref={containerRef}
      className={cn(
        'rounded-xl border border-border bg-card overflow-hidden scroll-mt-24',
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {node.name}
            </h3>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              {details.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" aria-hidden="true" />
              Load Order: {details.loadOrder}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <p className="text-foreground">{details.description}</p>
        </div>

        {/* What goes here */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-primary" aria-hidden="true" />
            What goes here
          </h4>
          <ul className="space-y-2">
            {details.whatGoesHere.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* When loaded */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            When loaded
          </h4>
          <p className="text-sm text-muted-foreground">{details.whenLoaded}</p>
        </div>

        {/* Example */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">
              Example content
            </h4>
            <button
              onClick={() => { void handleCopyExample() }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                copied
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
              aria-label={copied ? 'Copied!' : 'Copy example to clipboard'}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre
            tabIndex={0}
            className={cn(
              'p-4 rounded-lg text-sm overflow-x-auto',
              'bg-secondary/50 text-foreground',
              'border border-border',
              'font-mono leading-relaxed'
            )}
          >
            <code>{details.example}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
