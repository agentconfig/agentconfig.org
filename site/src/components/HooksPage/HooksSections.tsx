import type { VNode } from 'preact'
import { Lightbulb, TriangleAlert } from 'lucide-preact'
import { CodeBlock } from '@/components/CodeBlock'
import { CodeTabs } from '@/components/CodeBlock/CodeTabs'
import { codeSamples, furtherReadingLinks, normalizedEvents, providerPanels } from '@/data/hooksTutorial'
import { ProviderTabs, type ProviderTone } from './ProviderTabs'

const lifecycleStages = [
  {
    number: '1',
    label: 'Begin',
    events: ['Session start'],
    description: 'Load concise context and verify prerequisites.',
    className: 'border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/20',
    accentClassName: 'bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-100',
    layoutClassName: 'lg:col-span-2',
  },
  {
    number: '2',
    label: 'Ask',
    events: ['User prompt submitted'],
    description: 'Inspect the request before planning begins.',
    className: 'border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20',
    accentClassName: 'bg-violet-100 text-violet-900 dark:bg-violet-900/60 dark:text-violet-100',
    layoutClassName: 'lg:col-span-2',
  },
  {
    number: '3',
    label: 'Act',
    events: ['Before tool use', 'After tool use', 'Tool failure'],
    description: 'Gate side effects, then record the outcome.',
    className: 'border-orange-200 bg-orange-50/70 dark:border-orange-900 dark:bg-orange-950/20',
    accentClassName: 'bg-orange-100 text-orange-900 dark:bg-orange-900/60 dark:text-orange-100',
    layoutClassName: 'lg:col-span-2',
  },
  {
    number: '4',
    label: 'Preserve',
    events: ['Compaction'],
    description: 'Save the state needed after context is condensed.',
    className: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
    accentClassName: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100',
    layoutClassName: 'lg:col-span-3',
  },
  {
    number: '5',
    label: 'Finish',
    events: ['Agent stop'],
    description: 'Clean up state and publish the final signal.',
    className: 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/20',
    accentClassName: 'bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-100',
    layoutClassName: 'lg:col-span-3',
  },
] as const

const lifecycleProviders = [
  { id: 'copilot', label: 'GitHub Copilot', tone: 'copilot' as const, eventKey: 'copilot' as const },
  { id: 'claude', label: 'Claude Code', tone: 'claude' as const, eventKey: 'claude' as const },
  { id: 'codex', label: 'OpenAI Codex', tone: 'codex' as const, eventKey: 'codex' as const },
] as const

export function WhenHooksFitSection(): VNode {
  return (
    <section id="when-hooks" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">2. When Hooks Fit</h2>
      <p className="text-lg text-muted-foreground mb-6">Hooks are deterministic code that runs at defined points in an agent session.</p>
      <p>Use hooks when you need a machine-enforced policy, a repeatable side effect, or a concise progress signal that should not depend on the model remembering instructions. Use instructions when you need judgment guidance, skills when you need reusable procedures, and MCP when the agent needs a new tool. Hooks are the right primitive for runtime checks around tool calls, session boundaries, compaction, and externally visible actions.</p>
      <div className="not-prose my-8 rounded-xl border border-cyan-200 bg-cyan-50/70 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary mb-3">
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
          Hooks work well for
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Gate risky commands:</strong> block force-push, production deploys, secret reads, or destructive migrations unless policy allows them.</li>
          <li><strong>Publish compact progress:</strong> emit updates only when objective, phase, blocker, or attention changes.</li>
          <li><strong>Preserve continuity:</strong> checkpoint state before compaction and recover it at session start.</li>
          <li><strong>Keep audit trails:</strong> write structured local logs for tool decisions without exposing private data externally.</li>
        </ul>
      </div>
    </section>
  )
}

export function LifecycleModelSection(): VNode {
  return (
    <section id="lifecycle-model" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">3. Lifecycle Events</h2>
      <p className="text-lg text-muted-foreground mb-6">Lifecycle events are checkpoints where a hook can observe, allow, block, or record what happens next.</p>
      <p>Start with the boundary your policy needs instead of wiring every event. A command gate belongs before tool use; progress capture belongs after tool use; continuity belongs around compaction and session boundaries. Normalize that intent first, then translate it into each provider's event name.</p>
      <div className="not-prose my-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">A typical agent session</p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {lifecycleStages.map((stage) => (
            <li key={stage.label} className={`rounded-xl border p-4 ${stage.className} ${stage.layoutClassName}`}>
              <div className="mb-4 flex items-center gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${stage.accentClassName}`}>{stage.number}</span>
                <h3 className="font-semibold">{stage.label}</h3>
              </div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {stage.events.map((event) => <code key={event} className="rounded-md border border-current/15 bg-background/80 px-2 py-1 text-xs">{event}</code>)}
              </div>
              <p className="text-sm text-muted-foreground">{stage.description}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="not-prose my-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Provider event names</p>
        <ProviderTabs
          tabs={lifecycleProviders}
          idPrefix="lifecycle-provider"
          ariaLabel="Lifecycle provider event names"
          renderPanel={(provider) => (
            <ul className="grid gap-3 sm:grid-cols-2">
              {normalizedEvents.map((event) => {
                const eventName = event[provider.eventKey]
                return (
                  <li key={event.normalized} className="rounded-lg border border-current/10 bg-background/70 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{event.normalized}</h3>
                      {eventName === 'No direct equivalent'
                        ? <span className="text-xs italic text-muted-foreground">{eventName}</span>
                        : <code className="rounded-md border border-current/15 bg-background px-2 py-1 text-xs">{eventName}</code>}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.purpose}</p>
                  </li>
                )
              })}
            </ul>
          )}
        />
      </div>
    </section>
  )
}

export function ContractModelSection(): VNode {
  return (
    <section id="contract-model" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">4. Hook Contracts</h2>
      <p className="text-lg text-muted-foreground mb-6">Keep hook input, output, exit status, and diagnostics explicit.</p>
      <p>A durable hook contract has four parts: a JSON input payload, a structured output payload, an exit-code policy, and a diagnostics channel. The policy core should not know which provider invoked it. It should receive a normalized payload and return a decision that the provider adapter can translate.</p>
      <CodeTabs files={[{ path: 'normalized-event.json', content: codeSamples.normalizedPayload ?? '', language: 'json' }, { path: 'decision.json', content: codeSamples.hookDecision ?? '', language: 'json' }]} className="my-6" />
      <div className="my-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-3">Contract rule</h3>
        <p>Keep progress output separate from the final machine-readable decision. Human-readable logs belong on stderr or in a provider-supported diagnostics field; stdout should stay parseable when the provider expects JSON.</p>
      </div>
    </section>
  )
}

interface ProviderExample {
  readonly id: string
  readonly label: string
  readonly tone: ProviderTone
  readonly intro: VNode
  readonly configFile: { readonly path: string; readonly content: string; readonly language: string }
  readonly adapterFile: { readonly path: string; readonly content: string; readonly language: string }
}

export function FirstProviderHookSection(): VNode {
  const examples: readonly ProviderExample[] = [
    {
      id: 'copilot',
      label: 'GitHub Copilot',
      tone: 'copilot',
      intro: <p>Copilot repository hooks live under <code>.github/hooks/</code>. Put the provider config in a small JSON file and keep the policy in a script you can test outside the agent runtime.</p>,
      configFile: { path: '.github/hooks/pre-tool-use.json', language: 'json', content: codeSamples.copilotHook ?? '' },
      adapterFile: { path: '.github/hooks/policy.mjs', language: 'javascript', content: codeSamples.copilotAdapter ?? '' },
    },
    {
      id: 'claude',
      label: 'Claude Code',
      tone: 'claude',
      intro: <p>Claude hooks are configured in <code>.claude/settings.json</code>. Use shared project settings for team policy and keep personal or machine-specific automation in <code>.claude/settings.local.json</code>.</p>,
      configFile: { path: '.claude/settings.json', language: 'json', content: codeSamples.claudeHook ?? '' },
      adapterFile: { path: '.claude/hooks/adapter.mjs', language: 'javascript', content: codeSamples.claudeAdapter ?? '' },
    },
    {
      id: 'codex',
      label: 'OpenAI Codex',
      tone: 'codex',
      intro: <p>Codex reads repository hooks from <code>.codex/hooks.json</code>. Keep the adapter in the repository so the same fixture tests can run locally and in automation.</p>,
      configFile: { path: '.codex/hooks.json', language: 'json', content: codeSamples.codexHook ?? '' },
      adapterFile: { path: '.codex/hooks/policy.mjs', language: 'javascript', content: codeSamples.codexAdapter ?? '' },
    },
  ]

  return (
    <section id="first-provider-hook" className="scroll-mt-24 mb-16">
      {/* Preserve old fragment targets (#first-copilot-hook, #first-claude-hook)
          from before the two provider sections were merged, so existing
          links/bookmarks still land here (and select the matching tab). */}
      <span id="first-copilot-hook" className="scroll-mt-24" aria-hidden="true" />
      <span id="first-claude-hook" className="scroll-mt-24" aria-hidden="true" />
      <h2 className="text-3xl font-bold mb-4">1. Block One Risky Command</h2>
      <p className="text-lg text-muted-foreground mb-6">Start with a repository hook that blocks <code>git push</code>. It is deliberately small, easy to test, and easy to remove.</p>
      <p>Pick the provider you use. Each example connects a provider config file to a small adapter. Later sections show how to share the decision logic without making this first hook harder to understand.</p>
      <ProviderTabs
        tabs={examples}
        idPrefix="first-hook-provider"
        ariaLabel="First hook provider"
        legacyFragments={{ 'first-copilot-hook': 'copilot', 'first-claude-hook': 'claude' }}
        renderPanel={(example) => (
          <>
            {example.intro}
            <CodeBlock code={example.configFile.content} language={example.configFile.language} filename={example.configFile.path} className="my-6" />
            <CodeBlock code={example.adapterFile.content} language={example.adapterFile.language} filename={example.adapterFile.path} className="my-6" />
          </>
        )}
      />
    </section>
  )
}

export function ProviderPanelsSection(): VNode {
  return (
    <section id="provider-panels" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">5. Providers</h2>
      <p className="text-lg text-muted-foreground mb-6">Choose a provider to see its hook files, lifecycle events, and runtime contract in one focused view.</p>
      <ProviderTabs
        tabs={providerPanels}
        idPrefix="provider-details"
        ariaLabel="Provider details"
        renderPanel={(panel) => (
          <>
            <h3 className="text-xl font-semibold mb-2">{panel.label}</h3>
            <p className="mb-5">{panel.scope}</p>
            <dl className="space-y-5">
              <div>
                <dt className="font-semibold">Locations</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {panel.locations.map((location) => <code key={location} className="rounded-md border border-current/15 bg-background/80 px-2 py-1 text-xs">{location}</code>)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Events</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {panel.events.map((event) => <code key={event} className="rounded-md border border-current/15 bg-background/80 px-2 py-1 text-xs">{event}</code>)}
                </dd>
              </div>
              <div><dt className="font-semibold">Contract</dt><dd className="mt-1">{panel.contract}</dd></div>
            </dl>
            <ul className="mt-5 list-disc space-y-2 pl-5">{panel.notes.map((note) => <li key={note}>{note}</li>)}</ul>
            <p className="mt-5 text-sm text-muted-foreground">Source: <a href={panel.sourceUrl}>{panel.sourceTitle}</a></p>
          </>
        )}
      />
    </section>
  )
}

export function PolicyCoreSection(): VNode {
  return (
    <section id="policy-core" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">6. Reuse Policy Logic</h2>
      <p className="text-lg text-muted-foreground mb-6">Once the first hook works, move the repeated command check into a pure policy core and keep each provider adapter thin.</p>
      <p>The shared <code>hooks/policy-core.mjs</code> module takes normalized input and returns a deterministic decision. It does not read environment variables, shell out, call external APIs, or print progress. Provider adapters own I/O, schema translation, exit codes, and provider-specific response formats.</p>
      <CodeBlock code={codeSamples.policyCore ?? ''} language="javascript" filename="hooks/policy-core.mjs" className="my-6" />
    </section>
  )
}

export function SafeIntegrationsSection(): VNode {
  return (
    <section id="safe-integrations" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">7. Keep Integrations Safe</h2>
      <p className="text-lg text-muted-foreground mb-6">Hooks often sit next to shell commands, secrets, and external systems, so they need stricter defaults than ordinary scripts.</p>
      <ul className="my-6 list-disc space-y-3 pl-5">
        <li><strong>Shell injection:</strong> pass arguments as arrays and avoid shell interpolation for untrusted input.</li>
        <li><strong>Shell parsing:</strong> do not infer force-push arguments from raw shell text. The example policy blocks every detected <code>git push</code>; use a real shell parser or server-side branch protection when normal pushes must remain available.</li>
        <li><strong>Secrets:</strong> never echo tokens, never put credentials in hook config, and redact environment-derived values from diagnostics.</li>
        <li><strong>Untrusted content:</strong> treat retrieved documents, tool output, and user prompts as data, not instructions for the hook itself.</li>
        <li><strong>Data egress:</strong> fail closed before sending repository, user, or customer data to an external service unless policy explicitly allows it.</li>
        <li><strong>Unavailable services:</strong> fail open for optional telemetry, fail closed for policy gates, and make that choice explicit in tests.</li>
        <li><strong>Copilot timeouts:</strong> command hook timeouts are always fail-open, even for <code>preToolUse</code> and administrator policy hooks; use small timeouts and make policy-critical checks fast.</li>
      </ul>
      <CodeBlock code={codeSamples.safeShell ?? ''} language="typescript" filename="safe-shell.ts" className="my-6" />
    </section>
  )
}

export function TestingHooksSection(): VNode {
  return (
    <section id="testing-hooks" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">8. Test the Hook</h2>
      <p className="text-lg text-muted-foreground mb-6">Every example hook should have a fixture test and a host-level smoke test.</p>
      <p>Fixture tests prove the policy core handles known provider payloads. Smoke tests prove the provider adapter can read stdin, emit the expected output, and return the expected exit status in the host environment.</p>
      <CodeTabs files={[{ path: 'policy-core.test.ts', content: codeSamples.fixtureTest ?? '', language: 'typescript' }, { path: 'smoke-test.sh', content: codeSamples.smokeTest ?? '', language: 'bash' }]} className="my-6" />
    </section>
  )
}

export function WhenNotHooksSection(): VNode {
  return (
    <section id="when-not-hooks" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">9. Use Another Primitive</h2>
      <p className="text-lg text-muted-foreground mb-6">A hook should enforce runtime behavior. Pick the simpler primitive when the agent needs guidance, a reusable procedure, or a new tool.</p>
      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
          <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-cyan-200">Use instructions for judgment</h3>
          <p className="text-sm text-muted-foreground">Put coding conventions, review guidance, and repository context in <code>AGENTS.md</code>, <code>CLAUDE.md</code>, or another instruction file.</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-5 dark:border-violet-900 dark:bg-violet-950/20">
          <h3 className="mb-2 text-lg font-semibold text-violet-900 dark:text-violet-200">Use a skill for a procedure</h3>
          <p className="text-sm text-muted-foreground">Package a repeatable workflow as a skill or slash command when a person or agent should choose when it runs.</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
          <h3 className="mb-2 text-lg font-semibold text-emerald-900 dark:text-emerald-200">Use MCP for a new tool</h3>
          <p className="text-sm text-muted-foreground">Connect an MCP server when the agent needs structured access to an API, database, or external system.</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-5 dark:border-orange-900 dark:bg-orange-950/20">
          <h3 className="mb-2 text-lg font-semibold text-orange-900 dark:text-orange-200">Keep the hook for enforcement</h3>
          <p className="text-sm text-muted-foreground">Use a hook when the check must run at a lifecycle boundary even if the model forgets or chooses another path.</p>
        </div>
      </div>
      <div className="not-prose my-6 rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-400 mb-3">
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          Hook traps
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>Do not call slow external systems on every tool invocation; batch, throttle, or move that work to session boundaries.</li>
          <li>Do not silently rewrite user intent. Block with a clear message instead.</li>
          <li>Do not make hooks the only copy of business-critical policy. Keep the policy documented and reviewable.</li>
        </ul>
      </div>
    </section>
  )
}

export function FurtherReadingSection(): VNode {
  return (
    <section id="further-reading" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">Further Reading</h2>
      <div className="grid gap-4">
        {furtherReadingLinks.map((link) => (
          <a key={link.url} href={link.url} className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-semibold">{link.title}</h3>
              <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground">{link.source}</span>
            </div>
            <p className="text-sm text-muted-foreground">{link.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
