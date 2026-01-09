import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface HeroProps {
  className?: string
}

export function Hero({ className }: HeroProps): ReactNode {
  return (
    <div
      className={cn(
        'py-16 md:py-24 text-center',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          AI Primitives Guide
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Learn where to place configuration files for GitHub Copilot and Claude Code.
          Choose your preferred way to explore the primitives below.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <NavPill href="#file-tree">File Tree</NavPill>
          <NavPill href="#primitives">Primitives</NavPill>
          <NavPill href="#recipes">Recipes</NavPill>
          <NavPill href="#comparison">Comparison</NavPill>
        </div>
      </div>
    </div>
  )
}

interface NavPillProps {
  href: string
  children: ReactNode
}

function NavPill({ href, children }: NavPillProps): ReactNode {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        'px-6 py-3 rounded-full font-medium transition-all',
        'bg-card border border-border',
        'hover:bg-muted hover:border-primary/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      {children}
    </a>
  )
}
