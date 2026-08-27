import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { Hero } from '@/components/Hero'
import { Section } from '@/components/Section'
import { FileTreeSection } from '@/components/FileTree'
import { PrimitiveCardsSection } from '@/components/PrimitiveCards'
import { ProviderComparisonSection } from '@/components/ProviderComparison'
import { ScopeModelSection } from '@/components/ScopeModel'
import { ProviderStarter } from '@/components/GuidePage'
import { instructionStarterExamples } from '@/data/starterExamples'

export function App(): VNode {
  return (
    <PageLayout>
      <Hero />

      <div className="border-b border-border bg-card/40">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <ProviderStarter
              id="start-here"
              title="Give your agent one useful project file"
              description="Choose your provider, copy the smallest useful example, and put it in the documented location. Add more only after you see what the agent still gets wrong."
              primitiveId="persistent-instructions"
              examples={instructionStarterExamples}
            />
          </div>
        </div>
      </div>

      <Section
        id="primitives"
        title="Configuration Layers"
        description="Now that you have one working file, see the other configuration layers you can add when a real need appears."
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
