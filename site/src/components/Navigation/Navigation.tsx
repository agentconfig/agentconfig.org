import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { Menu, X, Github } from 'lucide-preact'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'
import { ProviderChooser } from './ProviderChooser'
import { useSelectedProvider } from './useSelectedProvider'

// Page-based navigation items
const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/skills/', label: 'Skills' },
  { href: '/agents/', label: 'Agents' },
  { href: '/hooks/', label: 'Hooks' },
  { href: '/mcp/', label: 'MCP' },
] as const

export interface NavigationProps {
  className?: string | undefined
}

export function Navigation({ className }: NavigationProps): VNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const selectedProvider = useSelectedProvider()

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen)
  }

  const providerAwareHref = (href: string): string => {
    if (selectedProvider === '') return href

    const url = new URL(href, window.location.origin)
    url.searchParams.set('provider', selectedProvider)
    return `${url.pathname}${url.search}`
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-background/80 backdrop-blur-sm border-b border-border',
        className
      )}
    >
      <nav
        className="container mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <a href="/" className="font-bold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
          agentconfig.org
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={providerAwareHref(item.href)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              {item.label}
            </a>
          ))}
          <ProviderChooser id="desktop-provider-chooser" selectedProvider={selectedProvider} />
          <a
            href="https://github.com/agentconfig/agentconfig.org"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'p-2 rounded-lg transition-colors',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-label="View on GitHub"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
          </a>
          <ThemeToggle className="ml-1" />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-1">
          <a
            href="https://github.com/agentconfig/agentconfig.org"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'p-2 rounded-lg transition-colors',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-label="View on GitHub"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
          </a>
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border bg-background"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={providerAwareHref(item.href)}
                onClick={() => { setIsMenuOpen(false) }}
                className={cn(
                  'px-4 py-3 rounded-lg text-left font-medium transition-colors',
                  'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                {item.label}
              </a>
            ))}
            <ProviderChooser id="mobile-provider-chooser" selectedProvider={selectedProvider} mobile />
          </div>
        </div>
      )}
    </header>
  )
}
