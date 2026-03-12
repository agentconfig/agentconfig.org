import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { Hero } from '@/components/Hero'
import { Section } from '@/components/Section'
import { FileTreeSection } from '@/components/FileTree'
import { PrimitiveCardsSection } from '@/components/PrimitiveCards'
import { ProviderComparisonSection } from '@/components/ProviderComparison'

export function App(): VNode {
  return (
    <PageLayout>
      <Hero />

      <Section
        id="primitives"
        title="AI Primitives"
        description="Explore the 11 core primitives that power AI coding assistants. Each primitive serves a specific purpose in customizing AI behavior."
      >
        <PrimitiveCardsSection />
      </Section>

      <Section
        id="file-tree"
        title="Interactive File Tree"
        description="See exactly where AI primitive files live in your project. Click on any file to learn more about its purpose and how to configure it."
        className="bg-muted/30"
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
    </PageLayout>
  )
}
