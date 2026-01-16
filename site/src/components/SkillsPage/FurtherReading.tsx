import type { VNode } from 'preact'
import { ExternalLink } from 'lucide-preact'
import { cn } from '@/lib/utils'

interface ResourceLink {
  readonly title: string
  readonly url: string
  readonly description: string
}

const resources: readonly ResourceLink[] = [
  {
    title: 'agentskills.io',
    url: 'https://agentskills.io',
    description: 'The official specification site for Agent Skills.',
  },
  {
    title: 'SKILL.md Specification',
    url: 'https://agentskills.io/specification',
    description: 'Detailed specification for the SKILL.md format, including frontmatter constraints.',
  },
  {
    title: 'VS Code Skills Documentation',
    url: 'https://code.visualstudio.com/docs/copilot/customization/agent-skills',
    description: 'Official documentation for using skills with GitHub Copilot in VS Code.',
  },
  {
    title: 'Anthropic Skills Repository',
    url: 'https://github.com/anthropics/skills',
    description: 'Example skills from Anthropic, including the skill-creator for building your own.',
  },
  {
    title: 'Example Skills Tutorial',
    url: 'https://github.com/github/jonmagic-ai-tutorial/tree/main/.github/skills',
    description: 'Real-world skill examples from the Safety & Integrity team workshop.',
  },
]

export interface FurtherReadingProps {
  className?: string
}

export function FurtherReading({ className }: FurtherReadingProps): VNode {
  return (
    <section
      id="further-reading"
      aria-labelledby="further-reading-title"
      className={cn('scroll-mt-24', className)}
    >
      <h2
        id="further-reading-title"
        className="text-2xl md:text-3xl font-bold mb-2"
      >
        Further Reading
      </h2>
      <p className="text-muted-foreground mb-6">
        Resources to deepen your understanding of Agent Skills.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'block p-4 rounded-lg transition-all',
              'bg-card border border-border',
              'hover:border-primary/50 hover:shadow-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">{resource.title}</h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
