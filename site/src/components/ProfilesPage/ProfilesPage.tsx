import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { ProviderProfileTabs } from './ProviderProfileTabs'

export function ProfilesPage(): VNode {
  return (
    <PageLayout>
      <header className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Provider Compatibility Profiles
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A per-provider view of every primitive on agentconfig.org — support level, implementation,
            file location, and a link to the provider&apos;s own documentation where one exists.
            Generated directly from the same typed model that powers the homepage comparison table,
            so the two views can never drift apart.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl">
          <ProviderProfileTabs />
        </div>
      </div>
    </PageLayout>
  )
}
