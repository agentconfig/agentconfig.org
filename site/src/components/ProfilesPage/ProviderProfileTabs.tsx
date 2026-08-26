import { useRef, useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { ExternalLink } from 'lucide-preact'
import { cn } from '@/lib/utils'
import {
  providerProfiles,
  type ProfileCategory,
  type ProviderProfile,
} from '@/data/providerProfiles'
import { supportLevelColors, supportLevelIcons, supportLevelLabels } from '@/data/comparison'
import type { SupportLevel } from '@/data/primitives'

function SupportBadge({ level }: { level: SupportLevel }): VNode {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
        supportLevelColors[level]
      )}
    >
      <span aria-hidden="true">{supportLevelIcons[level]}</span>
      {supportLevelLabels[level]}
    </span>
  )
}

function CoverageSummary({ profile }: { profile: ProviderProfile }): VNode {
  const { coverage } = profile
  return (
    <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
      <span>
        <strong className="text-foreground">{coverage.total}</strong> primitives tracked
      </span>
      <span>
        <strong className="text-foreground">{coverage.full}</strong> full support
      </span>
      {coverage.partial > 0 && (
        <span>
          <strong className="text-foreground">{coverage.partial}</strong> partial
        </span>
      )}
      {coverage.diy > 0 && (
        <span>
          <strong className="text-foreground">{coverage.diy}</strong> DIY / manual
        </span>
      )}
      <span>
        <strong className="text-foreground">{coverage.cited}</strong> of {coverage.total} cited to provider documentation
      </span>
    </div>
  )
}

function CategorySection({ category }: { category: ProfileCategory }): VNode {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-foreground">{category.name}</h2>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-4 py-2 text-left font-semibold text-foreground">Primitive</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Support</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Implementation</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Location</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {category.entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/30 align-top">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{entry.name}</td>
                  <td className="px-4 py-3"><SupportBadge level={entry.support} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.implementation}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-background px-2 py-1 rounded font-mono text-foreground border border-border whitespace-nowrap">
                      {entry.location}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    {entry.sourceUrl != null ? (
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline whitespace-nowrap"
                      >
                        Docs
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

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
