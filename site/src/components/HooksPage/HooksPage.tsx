import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { GuideHero, GuideLayout, RelatedGuide } from '@/components/GuidePage'
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
        <RelatedGuide
          title="Installing a hook changes the trust boundary"
          description="Review plugin provenance, scripts, scopes, update behavior, and rollback before loading executable lifecycle automation."
          href="/install/"
        />
        <FurtherReadingSection />
      </GuideLayout>
    </PageLayout>
  )
}
