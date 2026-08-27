import type { VNode } from 'preact'
import { GuideHero } from '@/components/GuidePage'

export interface SkillsHeroProps {
  className?: string
}

export function SkillsHero({ className }: SkillsHeroProps): VNode {
  return (
    <GuideHero
      {...(className == null ? {} : { className })}
      title="Agent Skills"
      description="Start with one small reusable procedure, then learn how to make skills discoverable, focused, and efficient as they grow."
      badges={[
        { label: 'One working skill', tone: 'green' },
        { label: 'Clear structure', tone: 'yellow' },
        { label: 'Progressive disclosure', tone: 'red' },
      ]}
    />
  )
}
