import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { Hero } from '@/components/Hero'
import { Section } from '@/components/Section'
import { FileTreeSection } from '@/components/FileTree'
import { PrimitiveCardsSection } from '@/components/PrimitiveCards'
import { ProviderComparisonSection } from '@/components/ProviderComparison'
import { ScopeModelSection } from '@/components/ScopeModel'

export function App(): VNode {
  return (
    <PageLayout>
      <Hero />

      <Section
        id="primitives"
        title="Configuration Layers"
        description="Explore the primitives grouped by layer: instructions, procedures, tools/context, delegation, control/approval, memory/state, distribution, and verification/observability."
      >
        <PrimitiveCardsSection />
      </Section>

      <Section
        id="file-tree"
        title="Interactive File Tree"
        description="See exactly where AI primitive files live in your project. Click on any file to learn more about its purpose and how to configure it."
      >
        <FileTreeSection />
      </Section>

      <Section
        id="comparison"
        title="Provider Comparison"
        description="Compare how primitives are implemented across GitHub Copilot, Claude Code, Cursor, and OpenAI Codex."
      >
        <ProviderComparisonSection />
      </Section>

      <Section
        id="scope-model"
        title="Choose the Right Scope"
        description="Once you know which file or setting you need, decide whether it belongs to one user, a repository, a directory, a session, or a single tool call."
        className="bg-muted/30"
      >
        <ScopeModelSection />
      </Section>
    </PageLayout>
  )
}
