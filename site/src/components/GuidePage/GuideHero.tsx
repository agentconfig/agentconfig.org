import type { VNode } from 'preact'
import { cn } from '@/lib/utils'

export type GuideBadgeTone = 'green' | 'yellow' | 'red' | 'blue' | 'purple'

export interface GuideBadge {
  readonly label: string
  readonly tone: GuideBadgeTone
}

export interface GuideHeroProps {
  readonly title: string
  readonly description: string
  readonly badges: readonly GuideBadge[]
  readonly className?: string
}

const badgeClasses: Record<GuideBadgeTone, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

export function GuideHero({
  title,
  description,
  badges,
  className,
}: GuideHeroProps): VNode {
  return (
    <header className={cn('guide-hero border-b border-border', className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Guide progression">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={cn('rounded-full px-3 py-1 text-sm font-medium', badgeClasses[badge.tone])}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
