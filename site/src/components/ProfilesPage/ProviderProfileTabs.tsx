import { useRef, useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { cn } from '@/lib/utils'
import { providerProfiles } from '@/data/providerProfiles'
import { CategorySection, CoverageSummary } from './ProfileSections'

export function ProviderProfileTabs(): VNode {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const active = providerProfiles[activeIndex] ?? providerProfiles[0]

  if (active == null) {
    return <div className="text-muted-foreground">No provider profiles to display</div>
  }

  const selectTab = (index: number, focus: boolean): void => {
    setActiveIndex(index)
    if (focus) {
      tabRefs.current[index]?.focus()
    }
  }

  const handleKeyDown = (event: KeyboardEvent, index: number): void => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      selectTab((index + 1) % providerProfiles.length, true)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      selectTab((index - 1 + providerProfiles.length) % providerProfiles.length, true)
    } else if (event.key === 'Home') {
      event.preventDefault()
      selectTab(0, true)
    } else if (event.key === 'End') {
      event.preventDefault()
      selectTab(providerProfiles.length - 1, true)
    }
  }

  return (
    <div>
      <div className="overflow-x-auto mb-6">
        <div className="flex gap-1 border-b border-border w-max min-w-full" role="tablist" aria-label="Provider">
          {providerProfiles.map((profile, index) => (
            <button
              key={profile.provider}
              ref={(el) => { tabRefs.current[index] = el }}
              id={`profile-tab-${profile.provider}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls={`profile-panel-${profile.provider}`}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => { selectTab(index, false) }}
              onKeyDown={(event) => { handleKeyDown(event, index) }}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors inline-flex items-center gap-2 whitespace-nowrap',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                index === activeIndex
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <span aria-hidden="true">{profile.icon}</span>
              {profile.name}
            </button>
          ))}
        </div>
      </div>
      {providerProfiles.map((profile, index) => (
        <div
          key={profile.provider}
          id={`profile-panel-${profile.provider}`}
          role="tabpanel"
          aria-labelledby={`profile-tab-${profile.provider}`}
          tabIndex={0}
          hidden={index !== activeIndex}
        >
          <CoverageSummary profile={profile} />
          {profile.categories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
      ))}
    </div>
  )
}
