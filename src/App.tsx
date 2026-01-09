import { type ReactNode } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { Section } from '@/components/Section'
import { FileTreeSection } from '@/components/FileTree'
import { PrimitiveCardsSection } from '@/components/PrimitiveCards'

export function App(): ReactNode {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          <Hero />

          <Section
            id="file-tree"
            title="Interactive File Tree"
            description="See exactly where AI primitive files live in your project. Click on any file to learn more about its purpose and how to configure it."
          >
            <FileTreeSection />
          </Section>

          <Section
            id="primitives"
            title="AI Primitives"
            description="Explore the 12 core primitives that power AI coding assistants. Each primitive serves a specific purpose in customizing AI behavior."
            className="bg-muted/30"
          >
            <PrimitiveCardsSection />
          </Section>

          <Section
            id="recipes"
            title="Work Type Recipes"
            description="Not sure which primitives to use? Start with your task and we'll recommend the right combination of primitives."
          >
            <PlaceholderContent>
              Recipe cards coming soon...
            </PlaceholderContent>
          </Section>

          <Section
            id="comparison"
            title="Provider Comparison"
            description="Compare how primitives are implemented across GitHub Copilot and Claude Code side by side."
            className="bg-muted/30"
          >
            <PlaceholderContent>
              Comparison matrix coming soon...
            </PlaceholderContent>
          </Section>
        </main>

        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>Built to help developers configure AI coding assistants.</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

interface PlaceholderContentProps {
  children: ReactNode
}

function PlaceholderContent({ children }: PlaceholderContentProps): ReactNode {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
      {children}
    </div>
  )
}
