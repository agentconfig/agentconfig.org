import type { VNode } from 'preact'
import { ExternalLink, Lightbulb } from 'lucide-preact'
import { cn } from '@/lib/utils'
import { CodeTabs } from '@/components/CodeBlock'
import type { SkillExampleData } from '@/data/skillExamples'

export interface SkillExampleProps {
  example: SkillExampleData
  className?: string
}

const complexityColors: Record<SkillExampleData['complexity'], string> = {
  minimal: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

const complexityLabels: Record<SkillExampleData['complexity'], string> = {
  minimal: 'Minimal',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function SkillExample({ example, className }: SkillExampleProps): VNode {
  return (
    <section
      id={example.id}
      aria-labelledby={`${example.id}-title`}
      className={cn('scroll-mt-24 pb-12 border-b border-border last:border-0', className)}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2
              id={`${example.id}-title`}
              className="text-2xl md:text-3xl font-bold"
            >
              {example.displayName}
            </h2>
            <span
              className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                complexityColors[example.complexity]
              )}
            >
              {complexityLabels[example.complexity]} complexity
            </span>
          </div>
          <p className="text-muted-foreground">{example.description}</p>
        </div>
        {example.sourceUrl && (
          <a
            href={example.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              'bg-card border border-border hover:bg-muted',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View Source
          </a>
        )}
      </div>

      {/* What this demonstrates */}
      <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm font-medium text-primary">
          <strong>Demonstrates:</strong> {example.demonstrates}
        </p>
      </div>

      {/* Code tabs */}
      <div className="mb-6">
        <CodeTabs
          files={example.files.map((f) => {
            const file: { path: string; content: string; language?: string } = {
              path: f.path,
              content: f.content,
            }
            if (f.language !== undefined) {
              file.language = f.language
            }
            return file
          })}
        />
      </div>

      {/* Key takeaways */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
          <h3 className="font-semibold">Key Takeaways</h3>
        </div>
        <ul className="space-y-2">
          {example.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary font-medium">•</span>
              {takeaway}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
