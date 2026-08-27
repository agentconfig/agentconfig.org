import type { VNode } from 'preact'
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  Boxes,
  GitBranch,
  PlugZap,
} from 'lucide-preact'
import { Section } from '@/components/Section'
import { useSelectedProvider } from '@/components/Navigation/useSelectedProvider'
import { pages } from '@/data/pages'
import { providerAwareHref } from '@/lib/providerSelection'

const guideOrder = ['agents', 'skills', 'hooks', 'mcp', 'install', 'profiles'] as const

const guideVisuals: Record<string, {
  readonly label: string
  readonly Icon: typeof Bot
  readonly panel: string
  readonly icon: string
}> = {
  agents: {
    label: 'Agent Instructions',
    Icon: Bot,
    panel: 'hover:border-blue-300 dark:hover:border-blue-800',
    icon: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  skills: {
    label: 'Skills',
    Icon: BookOpenCheck,
    panel: 'hover:border-amber-300 dark:hover:border-amber-800',
    icon: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
  hooks: {
    label: 'Lifecycle Hooks',
    Icon: GitBranch,
    panel: 'hover:border-rose-300 dark:hover:border-rose-800',
    icon: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  },
  mcp: {
    label: 'MCP Tool Integrations',
    Icon: PlugZap,
    panel: 'hover:border-emerald-300 dark:hover:border-emerald-800',
    icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  },
  install: {
    label: 'Install & Share',
    Icon: Boxes,
    panel: 'hover:border-violet-300 dark:hover:border-violet-800',
    icon: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  },
  profiles: {
    label: 'Provider Profiles',
    Icon: Bot,
    panel: 'hover:border-cyan-300 dark:hover:border-cyan-800',
    icon: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  },
}

export function ExploreGuidesSection(): VNode {
  const selectedProvider = useSelectedProvider()
  const pageBySlug = new Map(pages.map((page) => [page.slug, page]))

  return (
    <Section
      id="explore-guides"
      title="Continue with an in-depth guide"
      description="The overview gives you the map. Pick the part you need next for examples, provider details, and practical implementation guidance."
      className="border-t border-border bg-gradient-to-b from-muted/35 to-background"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guideOrder.map((slug, index) => {
          const page = pageBySlug.get(slug)
          const visual = guideVisuals[slug]
          if (page == null || visual == null) return null

          const Icon = visual.Icon

          return (
            <a
              key={slug}
              href={providerAwareHref(`/${slug}/`, selectedProvider)}
              className={`group relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${visual.panel}`}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${visual.icon}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Guide 0{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">{visual.label}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{page.description}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Explore the guide
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          )
        })}
      </div>
    </Section>
  )
}
