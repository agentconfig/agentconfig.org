import type { TocItem } from '@/components/TableOfContents'

export interface FurtherReadingLink {
  title: string
  url: string
  source: string
  description: string
}

export const tocItems: readonly TocItem[] = [
  { id: 'what-is-apm', label: '1. What is APM?', level: 'beginner' },
  { id: 'why-it-matters', label: '2. Why It Matters', level: 'beginner' },
  { id: 'how-it-relates', label: '3. How It Relates to Primitives', level: 'beginner' },
  { id: 'manifest-mental-model', label: '4. Manifest Mental Model', level: 'intermediate' },
  { id: 'what-it-packages', label: '5. What It Packages', level: 'intermediate' },
  { id: 'when-to-use-apm', label: '6. When to Use APM', level: 'advanced' },
  { id: 'further-reading', label: '7. Further Reading' },
] as const

export const codeSamples: Record<string, string> = {
  manifestExample: `name: agentconfig.org
version: 1.0.0
dependencies:
  apm:
    - anthropics/skills/skills/frontend-design
    - github/awesome-copilot/agents/api-architect.agent.md
    - microsoft/apm-sample-package`,
  packagingMatrix: `apm.yml
  ├─ skills
  ├─ instructions
  ├─ prompts
  ├─ agents
  ├─ hooks/plugins
  └─ mcp servers`,
} as const

export const furtherReadingLinks: readonly FurtherReadingLink[] = [
  {
    title: 'Microsoft APM',
    url: 'https://microsoft.github.io/apm/',
    source: 'Microsoft',
    description: 'The main APM documentation site with concepts, manifests, and package examples.',
  },
  {
    title: 'Microsoft APM Repository',
    url: 'https://github.com/microsoft/apm',
    source: 'GitHub',
    description: 'Source code, examples, and issue tracker for the Agent Package Manager project.',
  },
  {
    title: 'agentskills.io Specification',
    url: 'https://agentskills.io/specification',
    source: 'agentskills.io',
    description: 'Useful background for understanding one of the primitives that APM can package.',
  },
  {
    title: 'AGENTS.md Specification',
    url: 'https://agents.md',
    source: 'agents.md',
    description: 'Background on the agent instruction files that APM can distribute alongside other assets.',
  },
  {
    title: 'MCP Specification',
    url: 'https://modelcontextprotocol.io/specification/latest',
    source: 'MCP Official',
    description: 'Reference for the MCP server configurations and tooling APM can bundle into a setup.',
  },
] as const
