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

  // Tables - detect markdown tables and convert to HTML
  // Match table blocks: consecutive lines starting and ending with |
  html = html.replace(/(?:^\|.+\|$\n?)+/gm, (tableBlock) => {
    const rows = tableBlock.trim().split('\n')
    if (rows.length < 2) return tableBlock

    // Check if second row is separator (contains only |, -, :, and spaces)
    const isSeparator = /^\|[\s\-:|]+\|$/.test(rows[1] ?? '')
    if (!isSeparator) return tableBlock

    const headerCells = (rows[0] ?? '').split('|').slice(1, -1).map(c => c.trim())
    const headerHtml = headerCells.map(c => `<th class="break-words border border-border px-3 py-2 text-left font-semibold">${c}</th>`).join('')

    const bodyRows = rows.slice(2).map(row => {
      const cells = row.split('|').slice(1, -1).map(c => c.trim())
      const cellsHtml = cells.map(c => `<td class="break-words border border-border px-3 py-2">${c}</td>`).join('')
      return `<tr>${cellsHtml}</tr>`
    }).join('')

    return `<div class="max-w-full overflow-x-auto"><table class="w-full table-fixed border-collapse mb-4"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyRows}</tbody></table></div>`
  })

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc list-outside mb-4 space-y-1">$&</ul>')

  // Ordered lists (1. 2. 3. etc)
  html = html.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>')
  html = html.replace(/(<oli>.*<\/oli>\n?)+/g, '<ol class="list-decimal list-outside ml-4 mb-4 space-y-1">$&</ol>')
  html = html.replace(/<oli>/g, '<li class="ml-4">').replace(/<\/oli>/g, '</li>')

  // Paragraphs (double newlines)
  html = html.replace(/\n\n/g, '</p><p class="mb-4">')
  html = `<p class="mb-4">${html}</p>`

  // Clean up empty paragraphs
  html = html.replace(/<p class="mb-4"><\/p>/g, '')
  html = html.replace(/<p class="mb-4">(<h[23])/g, '$1')
  html = html.replace(/(<\/h[23]>)<\/p>/g, '$1')
  html = html.replace(/<p class="mb-4">(<ul|<ol|<table|<div class="max-w-full overflow-x-auto")/g, '$1')
  html = html.replace(/(<\/ul>|<\/ol>|<\/table>|<\/div>)<\/p>/g, '$1')

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
