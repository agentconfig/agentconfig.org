import type { VNode } from 'preact'
import { useState, useMemo } from 'preact/hooks'
import { Menu, X } from 'lucide-preact'
import { PageLayout } from '@/layouts'
import { useActiveSection } from '@/hooks'
import { cn } from '@/lib/utils'
import { tutorialSections, conceptsSectionIds } from '@/data/skillsTutorial'
import { skillExamples, exampleSectionIds } from '@/data/skillExamples'
import { SkillsHero } from './SkillsHero'
import { SkillsSidebar } from './SkillsSidebar'
import { TutorialSection } from './TutorialSection'
import { SkillExample } from './SkillExample'
import { FurtherReading } from './FurtherReading'

export function SkillsPage(): VNode {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Combine all section IDs for the active section tracker
  const allSectionIds = useMemo(() => [
    ...conceptsSectionIds,
    ...exampleSectionIds,
    'further-reading',
  ], [])

  const activeSection = useActiveSection({ sectionIds: allSectionIds })

  return (
    <PageLayout llmsPath="/skills.md">
      <SkillsHero />

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4">
          <button
            onClick={() => { setIsMobileSidebarOpen(!isMobileSidebarOpen) }}
            className={cn(
              'flex items-center gap-2 py-3 text-sm font-medium w-full',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-expanded={isMobileSidebarOpen}
            aria-controls="mobile-sidebar"
          >
            {isMobileSidebarOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
            {isMobileSidebarOpen ? 'Close navigation' : 'Tutorial sections'}
          </button>
        </div>

        {/* Mobile sidebar dropdown */}
        {isMobileSidebarOpen && (
          <div
            id="mobile-sidebar"
            className="border-t border-border bg-background py-4"
          >
            <div className="container mx-auto px-4">
              <SkillsSidebar
                activeSection={activeSection}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main content with sidebar */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <SkillsSidebar activeSection={activeSection} />
            </div>
          </aside>

          {/* Tutorial content */}
          <div className="min-w-0 max-w-3xl">
            {/* Concepts sections */}
            <div className="mb-16">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8">
                Concepts
              </h2>
              <div className="space-y-12">
                {tutorialSections.map((section) => (
                  <TutorialSection key={section.id} section={section} />
                ))}
              </div>
            </div>

            {/* Example skills */}
            <div className="mb-16">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8">
                Examples
              </h2>
              <p className="text-muted-foreground mb-8">
                Five example skills, progressing from minimal to sophisticated. Each demonstrates
                different aspects of skill design.
              </p>
              <div className="space-y-12">
                {skillExamples.map((example) => (
                  <SkillExample key={example.id} example={example} />
                ))}
              </div>
            </div>

            {/* Further reading */}
            <FurtherReading />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
