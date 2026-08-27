import type { VNode } from 'preact'
import {
  ArrowRight,
  Bot,
  Building2,
  Download,
  ExternalLink,
  FileCheck2,
  FolderGit2,
  Laptop,
  Package,
  SearchCheck,
  ShieldCheck,
  Store,
  User,
} from 'lucide-preact'
import { CodeBlock } from '@/components/CodeBlock'
import { GuideHero, GuideLayout } from '@/components/GuidePage'
import { PageLayout } from '@/layouts'
import { ProviderTabs } from '@/components/ProviderTabs'
import {
  codeSamples,
  furtherReadingLinks,
  installLayers,
  installPaths,
  installUnits,
  lifecycleSteps,
  nativeInstallProfiles,
  tocItems,
  trustItems,
} from '@/data/installTutorial'

const inlineCodeClass = 'rounded bg-background px-1.5 py-0.5 font-mono text-[0.95em] text-foreground'

const layerVisuals = [
  { Icon: FileCheck2, panel: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/25', icon: 'bg-emerald-500 text-white' },
  { Icon: Package, panel: 'border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/25', icon: 'bg-sky-500 text-white' },
  { Icon: Store, panel: 'border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/25', icon: 'bg-violet-500 text-white' },
  { Icon: Download, panel: 'border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/25', icon: 'bg-amber-500 text-white' },
  { Icon: Bot, panel: 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/25', icon: 'bg-rose-500 text-white' },
] as const

const installScopes = [
  {
    name: 'User',
    description: 'Personal tools and workflows used across projects. Keep credentials and machine-specific values out of repositories.',
    Icon: User,
    accent: 'border-cyan-200 bg-cyan-50/60 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/20 dark:text-cyan-300',
  },
  {
    name: 'Repository',
    description: 'Shared packages every contributor should be able to restore from version-controlled manifests or settings.',
    Icon: FolderGit2,
    accent: 'border-emerald-200 bg-emerald-50/60 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300',
  },
  {
    name: 'Local repository',
    description: 'Machine-specific or experimental configuration that should not be committed.',
    Icon: Laptop,
    accent: 'border-amber-200 bg-amber-50/60 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300',
  },
  {
    name: 'Organization or managed',
    description: 'Approved marketplaces, required plugins, allowlists, policy, and centrally governed defaults.',
    Icon: Building2,
    accent: 'border-violet-200 bg-violet-50/60 text-violet-700 dark:border-violet-900 dark:bg-violet-950/20 dark:text-violet-300',
  },
] as const

const lifecycleGroups = [
  {
    label: 'Adopt safely',
    description: 'Understand and establish the dependency.',
    steps: lifecycleSteps.slice(0, 4),
    accent: 'text-cyan-700 dark:text-cyan-300',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200',
    border: 'border-cyan-200/80 dark:border-cyan-900/80',
  },
  {
    label: 'Operate safely',
    description: 'Keep the dependency healthy and reversible.',
    steps: lifecycleSteps.slice(4),
    accent: 'text-violet-700 dark:text-violet-300',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
    border: 'border-violet-200/80 dark:border-violet-900/80',
  },
] as const

export function InstallPage(): VNode {
  return (
    <PageLayout llmsPath="/install.md">
      <GuideHero
        title="Packaging, Installing, and Sharing Agent Configuration"
        description="Start with the smallest useful component, then add portable packaging, reproducible installation, and policy only when sharing requires them."
        badges={[
          { label: 'Smallest useful unit', tone: 'green' },
          { label: 'Portable packages', tone: 'yellow' },
          { label: 'Trust before install', tone: 'red' },
        ]}
      />

      <GuideLayout tocItems={tocItems}>
        <section id="first-install" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">1. Install one reviewed package</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Installation is a trust decision, not just a copy command. Review what a package adds before you let an agent runtime load it.
          </p>
          <CodeBlock code={codeSamples.reviewChecklist} language="text" filename="Review checklist" className="my-6" />
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-semibold">Start narrow</p>
            <p className="mt-2">
              Install one reviewed skill, server, or plugin at the narrowest useful scope. Confirm what changed before installing the next one.
            </p>
          </div>
        </section>

        <section id="layers" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">2. Understand the layers</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Package formats, marketplaces, installers, and runtimes solve different problems. Keeping them separate makes the ecosystem easier to reason about.
          </p>
          <div className="not-prose relative my-8">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-6 hidden h-px bg-gradient-to-r from-emerald-400 via-violet-400 to-rose-400 md:block" />
            <ol className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {installLayers.map((layer, index) => {
              const visual = layerVisuals[index] ?? layerVisuals[0]
              const Icon = visual.Icon

              return (
                <li key={layer.name} className={`relative rounded-2xl border p-4 shadow-sm ${visual.panel}`}>
                  <div className="relative z-10 mb-5 flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${visual.icon}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold leading-tight text-foreground">{layer.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{layer.job}</p>
                  <p className="mt-4 rounded-lg bg-background/75 px-2.5 py-2 text-[11px] leading-relaxed text-foreground/80">
                    {layer.examples}
                  </p>
                  {index < installLayers.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-5 z-20 hidden h-5 w-5 rounded-full bg-background text-muted-foreground md:block" aria-hidden="true" />
                  )}
                </li>
              )
            })}
            </ol>
          </div>
        </section>

        <section id="smallest-unit" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">3. Choose the smallest install unit</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Choose the smallest thing that solves the sharing problem.
          </p>
          <div className="not-prose grid gap-4 md:grid-cols-2">
            {installUnits.map((unit, index) => (
              <article
                key={unit.need}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md ${index === installUnits.length - 1 ? 'md:col-span-2' : ''}`}
              >
                <span className="absolute -right-1 -top-5 text-7xl font-black text-muted/60 transition-colors group-hover:text-primary/10" aria-hidden="true">
                  {index + 1}
                </span>
                <p className="relative pr-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">When this is true</p>
                <p className="relative mt-2 max-w-xl font-medium text-foreground">{unit.need}</p>
                <div className="relative my-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="h-px flex-1 bg-border" />
                </div>
                <p className="relative text-lg font-bold text-primary">{unit.choose}</p>
                <p className="relative mt-2 text-sm text-muted-foreground">{unit.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="portable-package" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">4. Package portable components</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Agent Plugins 1.0 standardizes the portable package layout.
          </p>
          <p>
            The standard packages Agent Skills from <code className={inlineCodeClass}>skills/</code> and MCP server configuration from <code className={inlineCodeClass}>mcp.json</code>. A reverse-domain directory gives each client room for non-portable components such as agents, hooks, commands, or UI.
          </p>
          <div className="grid gap-6 my-6 md:grid-cols-2">
            <CodeBlock code={codeSamples.pluginLayout} language="text" filename="Plugin layout" />
            <CodeBlock code={codeSamples.pluginManifest} language="json" filename="plugin.json" />
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
            <p className="font-semibold">What the standard does not define</p>
            <p className="mt-2">
              Agent Plugins does not define installation, discovery, permissions, sandboxing, trust policy, or user experience. Clients and package managers own those responsibilities.
            </p>
          </div>
        </section>

        <section id="native-install" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">5. Use native provider installation</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Native installers usually provide the best client-specific browsing, scope selection, enablement, and removal experience.
          </p>
          <ProviderTabs
            tabs={nativeInstallProfiles}
            idPrefix="native-install"
            ariaLabel="Provider plugin installation"
            queryParam="provider"
            renderPanel={(profile) => (
              <div className="space-y-5">
                <p className="font-medium text-foreground">{profile.summary}</p>
                <CodeBlock code={profile.code} language={profile.language} filename={profile.filename} />
                <a
                  href={profile.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read the provider documentation
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            )}
          />
        </section>

        <section id="apm" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">6. Make project setup reproducible with APM</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            The{' '}
            <a href="https://microsoft.github.io/apm/" target="_blank" rel="noopener noreferrer">
              Agent Package Manager (APM)
            </a>{' '}
            manages installation and integrity; it does not control the agent at runtime.
          </p>
          <p>
            APM uses an <code className={inlineCodeClass}>apm.yml</code> manifest and <code className={inlineCodeClass}>apm.lock.yaml</code> lockfile to resolve agent configuration and deploy each supported primitive into the directories a selected harness already understands.
          </p>
          <div className="grid gap-6 my-6 md:grid-cols-2">
            <CodeBlock code={codeSamples.apmManifest} language="yaml" filename="apm.yml" />
            <CodeBlock code={codeSamples.apmCommands} language="bash" filename="Dependency lifecycle" />
          </div>
          <div className="not-prose grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Install and integrity plane</h3>
              <p className="mt-2 text-sm text-muted-foreground">Resolution, lockfiles, hashes, policy, deployment, updates, and audit.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Runtime plane</h3>
              <p className="mt-2 text-sm text-muted-foreground">Permissions, sandboxing, tool approval, model behavior, and execution remain with the harness.</p>
            </div>
          </div>
        </section>

        <section id="scope" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">7. Choose installation scope</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Install at the narrowest scope that reaches the intended audience.
          </p>
          <div className="not-prose grid gap-4 sm:grid-cols-2">
            {installScopes.map(({ name, description, Icon, accent }, index) => (
              <div key={name} className={`relative overflow-hidden rounded-2xl border p-5 ${accent}`}>
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/80 shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground">Scope 0{index + 1}</span>
                </div>
                <h3 className="font-bold text-foreground">{name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="trust" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">8. Review trust and provenance</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Agent configuration can influence model behavior, execute local code, connect to remote systems, and request credentials. Treat it like a software dependency.
          </p>
          <div className="not-prose overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-background to-rose-50 p-5 shadow-sm dark:border-amber-900 dark:from-amber-950/30 dark:via-background dark:to-rose-950/20 sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">The installation trust boundary</h3>
                <p className="mt-1 text-sm text-muted-foreground">Know who published it, what can execute, where data goes, and how to reverse the change.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trustItems.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-amber-200/70 bg-background/80 px-4 py-3 shadow-sm dark:border-amber-900/70">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="lifecycle" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">9. Manage the lifecycle</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Installation is the beginning of dependency ownership, not the end.
          </p>
          <div className="not-prose grid gap-5 md:grid-cols-2">
            {lifecycleGroups.map((group, groupIndex) => (
              <div key={group.label} className={`rounded-2xl border bg-card p-5 ${group.border}`}>
                <div className="mb-5 flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${group.badge}`}>
                    {groupIndex === 0
                      ? <SearchCheck className="h-5 w-5" aria-hidden="true" />
                      : <ShieldCheck className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <div>
                    <h3 className={`font-bold ${group.accent}`}>{group.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>
                <ol className="space-y-3">
                  {group.steps.map(([step, description], index) => {
                    const stepNumber = groupIndex * 4 + index + 1
                    return (
                      <li key={step} className="relative flex gap-3 rounded-xl border border-border/80 bg-background/70 p-4">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${group.badge}`}>{stepNumber}</span>
                        <div>
                          <h4 className="font-semibold text-foreground">{step}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section id="choose-path" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">10. Choose an installation path</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Pick the mechanism by the job it needs to do, not by which ecosystem has the largest catalog.
          </p>
          <div className="not-prose overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left">Path</th>
                  <th className="px-4 py-3 text-left">Use when</th>
                  <th className="px-4 py-3 text-left">Tradeoff</th>
                </tr>
              </thead>
              <tbody>
                {installPaths.map((entry) => (
                  <tr key={entry.path} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">{entry.path}</td>
                    <td className="px-4 py-3">{entry.useWhen}</td>
                    <td className="px-4 py-3 text-muted-foreground">{entry.tradeoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="further-reading" className="scroll-mt-24">
          <h2 className="mb-4 text-3xl font-bold">11. Further reading</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Prefer specifications and provider documentation over marketplace descriptions when deciding what a package can do.
          </p>
          <div className="not-prose grid gap-4 md:grid-cols-2">
            {furtherReadingLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{link.title}</h3>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{link.description}</p>
                <span className="mt-3 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {link.source}
                </span>
              </a>
            ))}
          </div>
        </section>
      </GuideLayout>
    </PageLayout>
  )
}
