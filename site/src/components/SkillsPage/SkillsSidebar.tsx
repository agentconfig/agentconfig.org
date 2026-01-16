import type { VNode } from 'preact'
import { useState } from 'preact/hooks'
import type { JSX } from 'preact'
import { ChevronDown, ChevronRight } from 'lucide-preact'
import { cn } from '@/lib/utils'
import { tutorialSections } from '@/data/skillsTutorial'
import { skillExamples } from '@/data/skillExamples'

interface SidebarLinkProps {
  href: string
  label: string
  isActive: boolean
}

function SidebarLink({ href, label, isActive }: SidebarLinkProps): VNode {
  const handleClick = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>): void => {
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
        'block py-1.5 px-3 text-sm rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      {label}
    </a>
  )
}

interface SidebarSectionProps {
  title: string
  children: VNode | readonly VNode[]
  defaultOpen?: boolean
}

function SidebarSection({ title, children, defaultOpen = true }: SidebarSectionProps): VNode {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-4">
      <button
        onClick={() => { setIsOpen(!isOpen) }}
        className={cn(
          'flex items-center gap-1 w-full text-left py-2 px-3 text-sm font-semibold',
          'text-foreground hover:bg-muted rounded-md transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        )}
        {title}
      </button>
      {isOpen && (
        <div className="mt-1 ml-2 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

export interface SkillsSidebarProps {
  activeSection: string | null
  className?: string
}

export function SkillsSidebar({ activeSection, className }: SkillsSidebarProps): VNode {
  return (
    <nav
      aria-label="Tutorial navigation"
      className={cn('space-y-2', className)}
    >
      <SidebarSection title="Concepts">
        {tutorialSections.map((section) => (
          <SidebarLink
            key={section.id}
            href={`#${section.id}`}
            label={section.title}
            isActive={activeSection === section.id}
          />
        ))}
      </SidebarSection>

      <SidebarSection title="Examples">
        {skillExamples.map((example) => (
          <SidebarLink
            key={example.id}
            href={`#${example.id}`}
            label={example.displayName}
            isActive={activeSection === example.id}
          />
        ))}
      </SidebarSection>

      <SidebarSection title="Resources">
        <SidebarLink
          href="#further-reading"
          label="Further Reading"
          isActive={activeSection === 'further-reading'}
        />
      </SidebarSection>
    </nav>
  )
}
