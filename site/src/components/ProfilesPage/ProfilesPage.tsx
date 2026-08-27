import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { GuideHero } from '@/components/GuidePage'
import { ProviderProfileTabs } from './ProviderProfileTabs'

export function ProfilesPage(): VNode {
  return (
    <PageLayout llmsPath="/profiles.md">
      <GuideHero
        title="Provider Profiles"
        description="Choose a provider to see the files, settings, support level, and official documentation for every configuration primitive."
        badges={[
          { label: 'Choose a provider', tone: 'green' },
          { label: 'Find the right file', tone: 'yellow' },
          { label: 'Check official docs', tone: 'blue' },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl">
          <ProviderProfileTabs />
        </div>
      </div>
    </PageLayout>
  )
}
