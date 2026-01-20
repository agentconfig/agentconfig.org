import type { VNode } from 'preact'
import { useState } from 'preact/hooks'
import { cn } from '@/lib/utils'
import { CodeBlock } from './CodeBlock'

export interface CodeFile {
  readonly path: string
  readonly content: string
  readonly language?: string
}

export interface CodeTabsProps {
  /** Files to display as tabs */
  files: readonly CodeFile[]
  /** Additional CSS classes */
  className?: string
}

export function CodeTabs({ files, className }: CodeTabsProps): VNode {
  const [activeTab, setActiveTab] = useState(0)

  if (files.length === 0) {
    return <div className="text-muted-foreground">No files to display</div>
  }

  if (files.length === 1) {
    const file = files[0]
    if (!file) {
      return <div className="text-muted-foreground">No files to display</div>
    }
    return (
      <CodeBlock
        code={file.content}
        language={file.language ?? 'plaintext'}
        filename={file.path}
        className={className}
      />
    )
  }

  return (
    <div className={cn('rounded-lg overflow-hidden border border-border', className)}>
      {/* Tab buttons */}
      <div className="flex overflow-x-auto bg-muted/50 border-b border-border" tabIndex={0}>
        {files.map((file, index) => (
          <button
            key={file.path}
            onClick={() => { setActiveTab(index) }}
            className={cn(
              'px-4 py-2 text-sm font-mono whitespace-nowrap transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
              index === activeTab
                ? 'bg-background text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            {file.path}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <CodeBlock
        code={files[activeTab]?.content ?? ''}
        language={files[activeTab]?.language ?? 'plaintext'}
        className="border-0 rounded-none"
      />
    </div>
  )
}
