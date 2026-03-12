import type { VNode } from 'preact'
import { ExternalLink } from 'lucide-preact'
import { PageLayout } from '@/layouts'
import { CodeBlock } from '@/components/CodeBlock'
import { TableOfContents } from '@/components/TableOfContents'
import { codeSamples, furtherReadingLinks, tocItems } from '@/data/apmTutorial'

const inlineCodeClass = 'rounded bg-background px-1.5 py-0.5 font-mono text-[0.95em] text-foreground'

const featureRows = [
  ['Skills', 'Package reusable workflows and references in one installable dependency.'],
  ['Instructions', 'Distribute project guidance such as AGENTS.md, CLAUDE.md, or provider-specific instruction files.'],
  ['Prompts and Agents', 'Ship curated prompts and agent definitions together so teams get the same behaviors.'],
  ['Hooks, Plugins, and MCP', 'Bundle integrations and execution surfaces with the rest of the agent setup.'],
] as const

const decisionRows = [
  ['Use raw primitives only', 'When one repository is experimenting locally or the setup changes frequently.'],
  ['Use APM', 'When multiple repos or teams need the same agent setup with repeatable installs and versioning.'],
  ['Use both', 'When you still author the primitive files directly but want a clean way to distribute them.'],
] as const

export function ApmPage(): VNode {
  return (
    <PageLayout llmsPath="/apm.md">
      <header className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl font-bold md:text-5xl">Agent Package Manager</h1>
          <p className="mt-4 max-w-3xl text-xl text-muted-foreground">
            Learn where APM fits in the agent tooling landscape: not as a replacement for
            primitives, but as a packaging layer that can assemble them into a repeatable,
            portable setup.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Mental model
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
              Emerging ecosystem
            </span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Packaging and distribution
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="lg:w-[260px] flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <TableOfContents items={tocItems} />
            </div>
          </aside>

          <div className="flex-1 min-w-0 max-w-3xl">
            <article className="prose prose-neutral max-w-none dark:prose-invert">
              <section id="what-is-apm" className="scroll-mt-24 mb-16">
                <h2 className="mb-4 text-3xl font-bold">1. What is APM?</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  APM stands for Agent Package Manager. It introduces a manifest-driven way to
                  install and share collections of agent configuration assets.
                </p>
                <p>
                  The important framing is that APM sits above the individual files this site
                  already documents. You still have skills, instructions, prompts, agents,
                  hooks, plugins, and MCP servers. APM gives those pieces a package-manager-style
                  distribution mechanism.
                </p>
              </section>

              <section id="why-it-matters" className="scroll-mt-24 mb-16">
                <h2 className="mb-4 text-3xl font-bold">2. Why It Matters</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Teams are starting to accumulate non-trivial agent setups. Copy-pasting folders
                  across repositories does not scale well.
                </p>
                <ul className="space-y-3">
                  <li><strong>Versioning:</strong> Shared agent setups can evolve with explicit versions.</li>
                  <li><strong>Consistency:</strong> Multiple repositories can install the same curated bundle.</li>
                  <li><strong>Portability:</strong> The manifest captures more than one primitive at a time.</li>
                  <li><strong>Reviewability:</strong> Dependency changes become visible in source control.</li>
                </ul>
              </section>

              <section id="how-it-relates" className="scroll-mt-24 mb-16">
                <h2 className="mb-4 text-3xl font-bold">3. How It Relates to Primitives</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  APM is not another primitive in the same sense as skills or MCP. It is a layer
                  for packaging those primitives together.
                </p>
                <div className="my-8 rounded-lg border border-border bg-muted/40 p-6">
                  <p className="mb-2"><strong>Good mental model:</strong></p>
                  <ul className="space-y-2">
                    <li><code className={inlineCodeClass}>SKILL.md</code> defines a workflow</li>
                    <li><code className={inlineCodeClass}>AGENTS.md</code> or provider instruction files define guidance</li>
                    <li><code className={inlineCodeClass}>mcp.json</code> or equivalent connects tools</li>
                    <li><code className={inlineCodeClass}>apm.yml</code> can assemble and distribute those files as one package</li>
                  </ul>
                </div>
              </section>

              <section id="manifest-mental-model" className="scroll-mt-24 mb-16">
                <h2 className="mb-4 text-3xl font-bold">4. Manifest Mental Model</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Think of <code className={inlineCodeClass}>apm.yml</code> the same way you think
                  about other dependency manifests: it describes what should be installed,
                  pinned, and shared.
                </p>
                <CodeBlock
                  code={codeSamples.manifestExample ?? ''}
                  language="yaml"
                  filename="apm.yml"
                  className="my-6"
                />
                <CodeBlock
                  code={codeSamples.packagingMatrix ?? ''}
                  language="text"
                  filename="Packaging view"
                  className="my-6"
                />
              </section>

              <section id="what-it-packages" className="scroll-mt-24 mb-16">
                <h2 className="mb-4 text-3xl font-bold">5. What It Packages</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  The interesting part of APM is breadth: it can describe a full agent environment,
                  not just one kind of file.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 pr-4 text-left">Asset</th>
                        <th className="py-2 text-left">Why it matters</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featureRows.map(([name, description]) => (
                        <tr key={name} className="border-b last:border-b-0">
                          <td className="py-3 pr-4 font-medium">{name}</td>
                          <td className="py-3">{description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="when-to-use-apm" className="scroll-mt-24 mb-16">
                <h2 className="mb-4 text-3xl font-bold">6. When to Use APM</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Use primitives first to understand the pieces. Reach for APM when you need a
                  reliable way to distribute those pieces together.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 pr-4 text-left">Approach</th>
                        <th className="py-2 text-left">Best fit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decisionRows.map(([approach, fit]) => (
                        <tr key={approach} className="border-b last:border-b-0">
                          <td className="py-3 pr-4 font-medium">{approach}</td>
                          <td className="py-3">{fit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="further-reading" className="scroll-mt-24">
                <h2 className="mb-4 text-3xl font-bold">7. Further Reading</h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Start with the official docs, then use the primitive specifications to ground the
                  individual files APM can package.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {furtherReadingLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="font-semibold">{link.title}</h3>
                        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">{link.description}</p>
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {link.source}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
