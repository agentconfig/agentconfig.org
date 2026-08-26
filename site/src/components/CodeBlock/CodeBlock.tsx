import { useEffect, useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { Check, Copy } from 'lucide-preact'
import { cn } from '@/lib/utils'
import { highlightCode } from '@/lib/highlighter'

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
  const [highlighted, setHighlighted] = useState<{ code: string; language: string | undefined; html: string } | null>(null)

  useEffect(() => {
    let cancelled = false

    void highlightCode(code, language).then((html) => {
      if (!cancelled) {
        setHighlighted({ code, language, html })
      }
    }).catch((err: unknown) => {
      // Highlighting is a progressive enhancement — if the dynamic Shiki
      // chunk or highlight call fails, keep the plain <pre> fallback and
      // just log rather than surfacing an unhandled rejection.
      console.error('Failed to highlight code block:', err)
    })

    return () => {
      cancelled = true
    }
  }, [code, language])

  // Only trust the cached highlight result when it matches the current
  // code/language — CodeTabs reuses this component instance across tab
  // switches, so a pending highlight from the previous tab must not render
  // paired with the new tab's header/copy button.
  const highlightedHtml =
    highlighted != null && highlighted.code === code && highlighted.language === language
      ? highlighted.html
      : null

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
    <div className={cn('not-prose relative group overflow-hidden rounded-xl border border-border bg-[#f6f8fa] shadow-sm dark:bg-[#0d1117]', className)}>
      {/* Header with filename/language and copy button */}
      <div className="flex items-center justify-between border-b border-border bg-muted/70 px-4 py-2">
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
      {highlightedHtml != null ? (
        <div
          className="shiki-container overflow-x-auto bg-[#f6f8fa] text-sm dark:bg-[#0d1117]"
          tabIndex={0}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="overflow-x-auto bg-[#f6f8fa] p-4 text-sm dark:bg-[#0d1117]" tabIndex={0}>
          <code className="font-mono text-foreground whitespace-pre">{code}</code>
        </pre>
      )}
    </div>
  )
}
