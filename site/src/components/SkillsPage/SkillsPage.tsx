import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { Section } from '@/components/Section'

export function SkillsPage(): VNode {
  return (
    <PageLayout>
      <Section
        id="skills-hero"
        title="Skills"
        description="Reusable capabilities that extend what your AI coding assistant can do."
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
