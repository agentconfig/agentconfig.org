import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { TableOfContents } from '@/components/TableOfContents'
import { tocItems } from '@/data/hooksTutorial'
import {
  ContractModelSection,
  FirstProviderHookSection,
  FurtherReadingSection,
  LifecycleModelSection,
  PolicyCoreSection,
  ProviderPanelsSection,
  SafeIntegrationsSection,
  TestingHooksSection,
  WhenHooksFitSection,
  WhenNotHooksSection,
} from './HooksSections'

export function HooksPage(): VNode {
  return (
    <PageLayout llmsPath="/hooks.md">
      <header className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lifecycle Hooks
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Build deterministic automation around agent lifecycle events. Start with a vendor-neutral contract, then map it to Copilot hooks, Claude settings hooks, and other provider surfaces.
          </p>
          <div className="flex gap-2 mt-6 flex-wrap">
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Contract first
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Provider mapped
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              Security focused
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="lg:w-[260px] flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <TableOfContents items={tocItems} />
            </div>
          </aside>

          <div className="flex-1 min-w-0 max-w-3xl">
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              <WhenHooksFitSection />
              <LifecycleModelSection />
              <ContractModelSection />
              <FirstProviderHookSection />
              <ProviderPanelsSection />
              <PolicyCoreSection />
              <SafeIntegrationsSection />
              <TestingHooksSection />
              <WhenNotHooksSection />
              <FurtherReadingSection />
            </article>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
