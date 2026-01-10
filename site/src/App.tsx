import type { VNode } from 'preact'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { Section } from '@/components/Section'
import { FileTreeSection } from '@/components/FileTree'
import { PrimitiveCardsSection } from '@/components/PrimitiveCards'
import { ProviderComparisonSection } from '@/components/ProviderComparison'

export function App(): VNode {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          <Hero />

          <Section
            id="primitives"
            title="AI Primitives"
            description="Explore the 9 core primitives that power AI coding assistants. Each primitive serves a specific purpose in customizing AI behavior."
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
            description="Compare how primitives are implemented across GitHub Copilot and Claude Code side by side."
          >
            <ProviderComparisonSection />
          </Section>
        </main>

        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>Brought to you by <a href="https://jonmagic.com" className="underline hover:text-foreground transition-colors">jonmagic</a>.</p>
            <p className="mt-2 text-sm">
              <a href="/llms.txt" className="hover:text-foreground transition-colors">llms.txt</a>
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
