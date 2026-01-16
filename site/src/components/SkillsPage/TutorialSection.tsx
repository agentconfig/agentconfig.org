import type { VNode } from 'preact'
import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/CodeBlock'
import type { TutorialSection as TutorialSectionData } from '@/data/skillsTutorial'

export interface TutorialSectionProps {
  section: TutorialSectionData
  className?: string
}

/**
 * Renders markdown-like content with code blocks.
 * Splits content by triple backticks and renders code blocks appropriately.
 */
function renderContent(content: string): VNode[] {
  const parts = content.split(/```(\w+)?\n([\s\S]*?)```/g)
  const elements: VNode[] = []

  let i = 0
  while (i < parts.length) {
    // Text part (before a code block or after the last one)
    if (parts[i]) {
      elements.push(
        <div
          key={`text-${i}`}
          className="prose prose-sm md:prose-base dark:prose-invert max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(parts[i] ?? '') }}
        />
      )
    }
    i++

    // Language and code parts come in pairs after the text
    if (i < parts.length && i + 1 < parts.length) {
      const language = parts[i] ?? 'plaintext'
      const code = parts[i + 1]?.trim() ?? ''
      if (code) {
        elements.push(
          <CodeBlock
            key={`code-${i}`}
            code={code}
            language={language}
            className="mb-4"
          />
        )
      }
      i += 2
    }
  }

  return elements
}

/**
 * Basic markdown parsing for text content.
 * Handles: bold, italic, links, inline code, headers, lists, tables.
 */
function parseMarkdown(text: string): string {
  let html = text
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">$1</code>')

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:no-underline">$1</a>'
  )

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (_match, row: string) => {
    const cells = row.split('|').map((cell: string) => cell.trim())
    const cellHtml = cells.map((cell: string) => `<td class="border border-border px-3 py-2">${cell}</td>`).join('')
    return `<tr>${cellHtml}</tr>`
  })
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)+/g, (tableMatch) => {
    // Check if first row is header (has --- pattern)
    const rows = tableMatch.split('</tr>').filter(Boolean)
    if (rows.length > 1 && rows[1]?.includes('---')) {
      const headerRow = (rows[0] ?? '').replace(/<td/g, '<th').replace(/<\/td>/g, '</th>')
      const bodyRows = rows.slice(2).join('</tr>')
      return `<table class="w-full border-collapse mb-4"><thead>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`
    }
    return `<table class="w-full border-collapse mb-4"><tbody>${tableMatch}</tbody></table>`
  })

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc list-outside mb-4 space-y-1">$&</ul>')

  // Paragraphs (double newlines)
  html = html.replace(/\n\n/g, '</p><p class="mb-4">')
  html = `<p class="mb-4">${html}</p>`

  // Clean up empty paragraphs
  html = html.replace(/<p class="mb-4"><\/p>/g, '')
  html = html.replace(/<p class="mb-4">(<h[23])/g, '$1')
  html = html.replace(/(<\/h[23]>)<\/p>/g, '$1')
  html = html.replace(/<p class="mb-4">(<ul|<table)/g, '$1')
  html = html.replace(/(<\/ul>|<\/table>)<\/p>/g, '$1')

  return html
}

export function TutorialSection({ section, className }: TutorialSectionProps): VNode {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className={cn('scroll-mt-24 pb-12 border-b border-border last:border-0', className)}
    >
      <h2
        id={`${section.id}-title`}
        className="text-2xl md:text-3xl font-bold mb-2"
      >
        {section.title}
      </h2>
      <p className="text-muted-foreground mb-6">{section.description}</p>
      <div className="mt-4">
        {renderContent(section.content)}
      </div>
    </section>
  )
}
