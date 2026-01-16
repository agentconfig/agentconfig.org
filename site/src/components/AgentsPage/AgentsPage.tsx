import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { Section } from '@/components/Section'

export function AgentsPage(): VNode {
  return (
    <PageLayout>
      <Section
        id="agents-hero"
        title="Agents"
        description="Autonomous AI assistants that can perform complex tasks in your codebase."
      >
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Coming soon...
          </p>
        </div>
      </Section>
    </PageLayout>
  )
}
