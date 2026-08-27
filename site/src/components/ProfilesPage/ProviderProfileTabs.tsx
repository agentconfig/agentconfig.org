import type { VNode } from 'preact'
import { ProviderTabs } from '@/components/ProviderTabs'
import type { ProviderTab } from '@/components/ProviderTabs'
import { providerProfiles } from '@/data/providerProfiles'
import { CategorySection, CoverageSummary } from './ProfileSections'

const tabs: readonly ProviderTab[] = providerProfiles.map((profile) => ({
  id: profile.provider,
  label: profile.name,
  tone: profile.provider,
}))

export function ProviderProfileTabs(): VNode {
  return (
    <ProviderTabs
      tabs={tabs}
      idPrefix="profile"
      ariaLabel="Provider profile"
      queryParam="provider"
      renderPanel={(tab) => {
        const profile = providerProfiles.find((candidate) => candidate.provider === tab.id)
        if (profile == null) {
          return <p className="text-muted-foreground">No provider profile to display.</p>
        }

        return (
          <>
            <CoverageSummary profile={profile} />
            {profile.categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </>
        )
      }}
    />
  )
}
