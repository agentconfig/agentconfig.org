import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { Check, Copy } from 'lucide-preact'
import { cn } from '@/lib/utils'

export interface CodeBlockProps {
  /** The code content to display */
  code: string
  /** Optional language label (e.g., "markdown", "typescript") */
  language?: string | undefined
  /** Optional filename to display */
  filename?: string | undefined
  /** Additional CSS classes */
  className?: string | undefined
}

export function CodeBlock({
  code,
  language,
  filename,
  className,
}: CodeBlockProps): VNode {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={cn('relative group rounded-lg overflow-hidden', className)}>
      {/* Header with filename/language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border">
        <span className="text-sm text-muted-foreground font-mono">
          {filename ?? language ?? 'code'}
        </span>
        <button
          onClick={() => { void handleCopy() }}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors',
            'hover:bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            copied ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
          )}
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="p-4 overflow-x-auto bg-muted/50 text-sm" tabIndex={0}>
        <code className="font-mono text-foreground whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}
