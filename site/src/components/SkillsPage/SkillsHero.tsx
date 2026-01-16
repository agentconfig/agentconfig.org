import type { VNode } from 'preact'
import { cn } from '@/lib/utils'

export interface SkillsHeroProps {
  className?: string
}

export function SkillsHero({ className }: SkillsHeroProps): VNode {
  return (
    <div className={cn('py-16 md:py-24 text-center', className)}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Building Agent Skills
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Learn how to create reusable, composable skills that extend what AI coding assistants can do.
          From simple documentation to sophisticated multimodal workflows.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <a
            href="https://agentskills.io"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'px-4 py-2 rounded-full font-medium transition-all',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
          >
            View the Spec
          </a>
          <a
            href="https://github.com/anthropics/skills"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'px-4 py-2 rounded-full font-medium transition-all',
              'bg-card border border-border',
              'hover:bg-muted hover:border-primary/50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
          >
            Example Skills
          </a>
        </div>
      </div>
    </div>
  )
}
