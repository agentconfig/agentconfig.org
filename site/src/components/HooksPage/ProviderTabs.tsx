import type { ComponentChildren, VNode } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { cn } from '@/lib/utils'

export type ProviderTone = 'copilot' | 'claude' | 'cursor' | 'codex'

export interface ProviderTab {
  readonly id: string
  readonly label: string
  readonly tone: ProviderTone
}

interface ProviderTabsProps<T extends ProviderTab> {
  readonly tabs: readonly T[]
  readonly idPrefix: string
  readonly ariaLabel: string
  readonly renderPanel: (tab: T) => ComponentChildren
  readonly legacyFragments?: Record<string, string>
  readonly queryParam?: string
}

interface ProviderSelectorProps<T extends ProviderTab> {
  readonly tabs: readonly T[]
  readonly idPrefix: string
  readonly ariaLabel: string
  readonly queryParam?: string
  readonly className?: string
}

const toneClasses: Record<ProviderTone, { active: string; panel: string }> = {
  copilot: {
    active: 'border-blue-500 bg-blue-100 text-blue-950 dark:border-cyan-400 dark:bg-cyan-950/50 dark:text-cyan-100',
    panel: 'border-blue-200 bg-blue-50/70 dark:border-cyan-900 dark:bg-cyan-950/20',
  },
  claude: {
    active: 'border-orange-500 bg-orange-100 text-orange-950 dark:border-orange-400 dark:bg-orange-950/50 dark:text-orange-100',
    panel: 'border-orange-200 bg-orange-50/70 dark:border-orange-900 dark:bg-orange-950/20',
  },
  cursor: {
    active: 'border-violet-500 bg-violet-100 text-violet-950 dark:border-violet-400 dark:bg-violet-950/50 dark:text-violet-100',
    panel: 'border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20',
  },
  codex: {
    active: 'border-emerald-500 bg-emerald-100 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-100',
    panel: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
  },
}

const providerSelectionEvent = 'hooks-provider-selection'

function findProviderIndex<T extends ProviderTab>(
  tabs: readonly T[],
  queryParam: string | undefined,
  legacyFragments?: Record<string, string>
): number {
  if (typeof window === 'undefined') return 0

  if (queryParam != null) {
    const providerId = new URLSearchParams(window.location.search).get(queryParam)
    const queryIndex = tabs.findIndex((tab) => tab.id === providerId)
    if (queryIndex >= 0) return queryIndex
  }

  if (legacyFragments != null) {
    const targetId = legacyFragments[window.location.hash.replace('#', '')]
    const legacyIndex = tabs.findIndex((tab) => tab.id === targetId)
    if (legacyIndex >= 0) return legacyIndex
  }

  return 0
}

function useProviderSelection<T extends ProviderTab>(
  tabs: readonly T[],
  queryParam: string | undefined,
  legacyFragments?: Record<string, string>
): {
    readonly activeIndex: number
    readonly selectTab: (index: number, focus: boolean) => void
    readonly handleKeyDown: (event: KeyboardEvent, index: number) => void
    readonly tabRefs: { current: (HTMLButtonElement | null)[] }
  } {
  const [activeIndex, setActiveIndex] = useState(() => findProviderIndex(tabs, queryParam, legacyFragments))
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const syncFromUrl = (): void => {
      setActiveIndex(findProviderIndex(tabs, queryParam, legacyFragments))
    }
    window.addEventListener('popstate', syncFromUrl)
    window.addEventListener(providerSelectionEvent, syncFromUrl)
    return () => {
      window.removeEventListener('popstate', syncFromUrl)
      window.removeEventListener(providerSelectionEvent, syncFromUrl)
    }
  }, [legacyFragments, queryParam, tabs])

  const selectTab = (index: number, focus: boolean): void => {
    const tab = tabs[index]
    if (tab == null) return

    setActiveIndex(index)
    if (queryParam != null && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set(queryParam, tab.id)
      window.history.replaceState(window.history.state, '', url)
      window.dispatchEvent(new Event(providerSelectionEvent))
    }
    if (focus) tabRefs.current[index]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent, index: number): void => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      selectTab((index + 1) % tabs.length, true)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      selectTab((index - 1 + tabs.length) % tabs.length, true)
    } else if (event.key === 'Home') {
      event.preventDefault()
      selectTab(0, true)
    } else if (event.key === 'End') {
      event.preventDefault()
      selectTab(tabs.length - 1, true)
    }
  }

  return { activeIndex, selectTab, handleKeyDown, tabRefs }
}

function ProviderTabButtons<T extends ProviderTab>({
  tabs,
  idPrefix,
  ariaLabel,
  activeIndex,
  selectTab,
  handleKeyDown,
  tabRefs,
  className,
}: Omit<ProviderSelectorProps<T>, 'queryParam'> & {
  readonly activeIndex: number
  readonly selectTab: (index: number, focus: boolean) => void
  readonly handleKeyDown: (event: KeyboardEvent, index: number) => void
  readonly tabRefs: { current: (HTMLButtonElement | null)[] }
}): VNode {
  return (
    <div className={cn('flex flex-wrap gap-2 rounded-xl bg-muted/60 p-2', className)} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(element) => { tabRefs.current[index] = element }}
          id={`${idPrefix}-${tab.id}-tab`}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-controls={`${idPrefix}-${tab.id}-panel`}
          tabIndex={index === activeIndex ? 0 : -1}
          onClick={() => { selectTab(index, false) }}
          onKeyDown={(event) => { handleKeyDown(event, index) }}
          className={cn(
            'rounded-lg border px-4 py-2 text-sm font-semibold transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            index === activeIndex
              ? toneClasses[tab.tone].active
              : 'border-transparent text-muted-foreground hover:border-border hover:bg-background/70 hover:text-foreground'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function ProviderSelector<T extends ProviderTab>({
  tabs,
  idPrefix,
  ariaLabel,
  queryParam,
  className,
}: ProviderSelectorProps<T>): VNode {
  const selection = useProviderSelection(tabs, queryParam)

  return (
    <div className={cn('flex flex-wrap gap-2 rounded-xl bg-muted/60 p-2', className)} role="group" aria-label={ariaLabel}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(element) => { selection.tabRefs.current[index] = element }}
          id={`${idPrefix}-${tab.id}`}
          type="button"
          aria-pressed={index === selection.activeIndex}
          onClick={() => { selection.selectTab(index, false) }}
          onKeyDown={(event) => { selection.handleKeyDown(event, index) }}
          className={cn(
            'rounded-lg border px-4 py-2 text-sm font-semibold transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            index === selection.activeIndex
              ? toneClasses[tab.tone].active
              : 'border-transparent text-muted-foreground hover:border-border hover:bg-background/70 hover:text-foreground'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function ProviderTabs<T extends ProviderTab>({
  tabs,
  idPrefix,
  ariaLabel,
  renderPanel,
  legacyFragments,
  queryParam,
}: ProviderTabsProps<T>): VNode {
  const selection = useProviderSelection(tabs, queryParam, legacyFragments)
  const { activeIndex } = selection
  const current = tabs[activeIndex] ?? tabs[0]

  if (current == null) {
    return <div className="text-muted-foreground">No provider examples to display</div>
  }

  return (
    <div className="not-prose my-6">
      <ProviderTabButtons tabs={tabs} idPrefix={idPrefix} ariaLabel={ariaLabel} {...selection} />
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={`${idPrefix}-${tab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${idPrefix}-${tab.id}-tab`}
          tabIndex={0}
          hidden={index !== activeIndex}
          className={cn('mt-4 rounded-xl border p-5 md:p-6', toneClasses[tab.tone].panel)}
        >
          {renderPanel(tab)}
        </div>
      ))}
    </div>
  )
}
