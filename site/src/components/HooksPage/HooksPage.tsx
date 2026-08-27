import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { GuideHero, GuideLayout } from '@/components/GuidePage'
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
      <GuideHero
        title="Lifecycle Hooks"
        description="Start with one small hook for Copilot, Claude Code, Cursor, or Codex. Then test it, share the policy logic, and add stricter integrations only when you need them."
        badges={[
          { label: 'Start small', tone: 'green' },
          { label: 'Provider examples', tone: 'yellow' },
          { label: 'Testable policy', tone: 'red' },
        ]}
      />
      <GuideLayout tocItems={tocItems}>
        <FirstProviderHookSection />
        <WhenHooksFitSection />
        <LifecycleModelSection />
        <ContractModelSection />
        <ProviderPanelsSection />
        <PolicyCoreSection />
        <SafeIntegrationsSection />
        <TestingHooksSection />
        <WhenNotHooksSection />
        <FurtherReadingSection />
      </GuideLayout>
    </PageLayout>
  )
}
