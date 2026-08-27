import type { VNode } from 'preact'
import type { JSX } from 'preact'
import { cn } from '@/lib/utils'

export interface HeroProps {
  className?: string
}

const navItems = [
  {
    href: '#start-here',
    label: 'Start Here',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    href: '#primitives',
    label: 'Layers',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    href: '#file-tree',
    label: 'File Tree',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    href: '#comparison',
    label: 'Comparison',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    href: '#scope-model',
    label: 'Scopes',
    className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
] as const

export function Hero({ className }: HeroProps): VNode {
  const handleClick = (event: JSX.TargetedMouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault()
    const href = event.currentTarget.getAttribute('href') ?? ''
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={cn('guide-hero border-b border-border', className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Configure AI Coding Assistants
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-6">
          Start with one useful project file, then explore the layers, locations, and provider-specific options behind it.
        </p>
        <div className="flex gap-2 flex-wrap">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleClick}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                item.className
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
