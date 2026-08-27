import type { VNode } from 'preact'
import { ExternalLink } from 'lucide-preact'
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
          <div className="not-prose space-y-3">
            {installLayers.map((layer, index) => (
              <div key={layer.name} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{layer.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{layer.job}</p>
                    <p className="mt-2 text-sm"><span className="font-medium">Examples:</span> {layer.examples}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="smallest-unit" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">3. Choose the smallest install unit</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Choose the smallest thing that solves the sharing problem.
          </p>
          <div className="not-prose overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left">Need</th>
                  <th className="px-4 py-3 text-left">Choose</th>
                  <th className="px-4 py-3 text-left">Why</th>
                </tr>
              </thead>
              <tbody>
                {installUnits.map((unit) => (
                  <tr key={unit.need} className="border-t border-border">
                    <td className="px-4 py-3">{unit.need}</td>
                    <td className="px-4 py-3 font-semibold">{unit.choose}</td>
                    <td className="px-4 py-3 text-muted-foreground">{unit.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            APM manages installation and integrity; it does not control the agent at runtime.
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
            {[
              ['User', 'Personal tools and workflows used across projects. Keep credentials and machine-specific values out of repositories.'],
              ['Repository', 'Shared packages every contributor should be able to restore from version-controlled manifests or settings.'],
              ['Local repository', 'Machine-specific or experimental configuration that should not be committed.'],
              ['Organization or managed', 'Approved marketplaces, required plugins, allowlists, policy, and centrally governed defaults.'],
            ].map(([scope, description]) => (
              <div key={scope} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">{scope}</h3>
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
          <div className="not-prose grid gap-3 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item} className="rounded-lg border border-border bg-card px-4 py-3 font-medium">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="lifecycle" className="scroll-mt-24 mb-16">
          <h2 className="mb-4 text-3xl font-bold">9. Manage the lifecycle</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Installation is the beginning of dependency ownership, not the end.
          </p>
          <div className="not-prose space-y-3">
            {lifecycleSteps.map(([step, description], index) => (
              <div key={step} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{index + 1}</span>
                <div>
                  <h3 className="font-semibold">{step}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
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
