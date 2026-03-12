import type { ComponentChildren, VNode } from 'preact'
import { ExternalLink } from 'lucide-preact'
import { CodeBlock } from '@/components/CodeBlock'
import { cn } from '@/lib/utils'

export interface ApmSpotlightProps {
  className?: string
}

interface SpotlightLink {
  readonly title: string
  readonly url: string
}

interface Takeaway {
  readonly title: string
  readonly description: ComponentChildren
}

const inlineFilenameClass = 'rounded bg-background px-1.5 py-0.5 font-mono text-[0.95em] text-foreground'

const manifestExample = `name: agentconfig.org
version: 1.0.0
dependencies:
  apm:
    - anthropics/skills/skills/frontend-design
    - github/awesome-copilot/agents/api-architect.agent.md
    - microsoft/apm-sample-package`

const links: readonly SpotlightLink[] = [
  {
    title: 'Read the APM docs',
    url: 'https://microsoft.github.io/apm/',
  },
  {
    title: 'View the GitHub repo',
    url: 'https://github.com/microsoft/apm',
  },
] as const

const takeaways: readonly Takeaway[] = [
  {
    title: 'What it is',
    description: <>A portable <code className={inlineFilenameClass}>apm.yml</code> manifest for installing skills, instructions, prompts, agents, hooks, plugins, and MCP servers.</>,
  },
  {
    title: 'Why it matters',
    description: 'It turns AI setup from copy-pasted folders into a versioned dependency graph that teams can share and update.',
  },
  {
    title: 'How it fits here',
    description: <>It does not replace <code className={inlineFilenameClass}>AGENTS.md</code>, <code className={inlineFilenameClass}>SKILL.md</code>, or MCP configs. It packages and distributes the primitives this site already documents.</>,
  },
] as const

export function ApmSpotlight({ className }: ApmSpotlightProps): VNode {
  return (
    <div className={cn('grid gap-6 lg:grid-cols-[1.15fr_0.85fr]', className)}>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          Emerging ecosystem layer
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
          APM packages the primitives this site explains
        </h3>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Microsoft&apos;s Agent Package Manager looks especially relevant to agentconfig.org
          because it introduces a package-manager-style distribution layer for the same
          agent files and behaviors developers are already assembling by hand.
        </p>

        <div className="mt-6 space-y-4">
          {takeaways.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-background/60 p-4">
              <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.title}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm md:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Mental model
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Think of <code className={inlineFilenameClass}>apm.yml</code> as the dependency
          manifest that can assemble multiple agent primitives into one reproducible setup.
          The underlying files still matter. APM makes them easier to install, pin, and
          share.
        </p>
        <CodeBlock
          code={manifestExample}
          language="yaml"
          filename="apm.yml"
          className="mt-4 border border-border bg-background"
        />
      </div>
    </div>
  )
}
