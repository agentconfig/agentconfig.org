import type { VNode } from 'preact'
import { CodeBlock } from '@/components/CodeBlock'
import { CodeTabs } from '@/components/CodeBlock/CodeTabs'
import { codeSamples, furtherReadingLinks, normalizedEvents, providerPanels } from '@/data/hooksTutorial'

export function WhenHooksFitSection(): VNode {
  return (
    <section id="when-hooks" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">1. When Hooks Fit</h2>
      <p className="text-lg text-muted-foreground mb-6">Hooks are deterministic code that runs at defined points in an agent session.</p>
      <p>Use hooks when you need a machine-enforced policy, a repeatable side effect, or a concise progress signal that should not depend on the model remembering instructions. Use instructions when you need judgment guidance, skills when you need reusable procedures, and MCP when the agent needs a new tool. Hooks are the right primitive for runtime checks around tool calls, session boundaries, compaction, and externally visible actions.</p>
      <div className="my-8 p-6 bg-muted/50 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-3">Good hook jobs</h3>
        <ul className="space-y-2">
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
      <h2 className="text-3xl font-bold mb-4">2. Lifecycle Model</h2>
      <p className="text-lg text-muted-foreground mb-6">Normalize provider-specific event names into the lifecycle your policy actually cares about.</p>
      <p>Providers use different names and event coverage, but most hook systems fit the same model: session boundaries, prompt boundaries, tool boundaries, compaction, and agent stop. Design around normalized events first, then write thin provider adapters.</p>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4">Normalized event</th>
              <th className="text-left py-2 pr-4">Use it for</th>
              <th className="text-left py-2 pr-4">Copilot</th>
              <th className="text-left py-2 pr-4">Claude</th>
              <th className="text-left py-2">Codex</th>
            </tr>
          </thead>
          <tbody>
            {normalizedEvents.map((event) => (
              <tr key={event.normalized} className="border-b">
                <td className="py-2 pr-4 font-medium">{event.normalized}</td>
                <td className="py-2 pr-4">{event.purpose}</td>
                <td className="py-2 pr-4 font-mono text-xs">{event.copilot}</td>
                <td className="py-2 pr-4 font-mono text-xs">{event.claude}</td>
                <td className="py-2 font-mono text-xs">{event.codex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function ContractModelSection(): VNode {
  return (
    <section id="contract-model" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">3. Contract Model</h2>
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

export function FirstCopilotHookSection(): VNode {
  return (
    <section id="first-copilot-hook" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">4. First Copilot Hook</h2>
      <p className="text-lg text-muted-foreground mb-6">Start with a repository-level pre-tool-use hook that blocks one risky command.</p>
      <p>Copilot repository hooks live under <code>.github/hooks/</code>. Put the provider config in a small JSON file and keep real policy in a script that can be tested outside the agent runtime.</p>
      <CodeBlock code={codeSamples.copilotHook ?? ''} language="json" filename=".github/hooks/pre-tool-use.json" className="my-6" />
      <CodeBlock code={codeSamples.copilotAdapter ?? ''} language="javascript" filename=".github/hooks/policy.mjs" className="my-6" />
    </section>
  )
}

export function FirstClaudeHookSection(): VNode {
  return (
    <section id="first-claude-hook" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">5. First Claude Hook</h2>
      <p className="text-lg text-muted-foreground mb-6">Map the same policy into Claude settings with a PreToolUse matcher.</p>
      <p>Claude hooks are configured inside settings files rather than a dedicated hooks directory. Use shared project settings for team policy and keep personal or machine-specific automation in local settings.</p>
      <CodeBlock code={codeSamples.claudeHook ?? ''} language="json" filename=".claude/settings.json" className="my-6" />
      <CodeBlock code={codeSamples.claudeAdapter ?? ''} language="javascript" filename=".claude/hooks/adapter.mjs" className="my-6" />
      <p>The adapter calls the same policy core as the Copilot hook. Only the normalization and provider response mapping change.</p>
    </section>
  )
}

export function ProviderPanelsSection(): VNode {
  return (
    <section id="provider-panels" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">6. Provider Panels</h2>
      <p className="text-lg text-muted-foreground mb-6">These panels are grounded in the provider documentation snapshots used by the documentation refresh skill.</p>
      <div className="space-y-6">
        {providerPanels.map((panel) => (
          <div key={panel.provider} className="p-6 rounded-lg border border-border bg-muted/30">
            <h3 className="text-xl font-semibold mb-2">{panel.provider}</h3>
            <p className="mb-4">{panel.scope}</p>
            <dl className="space-y-4">
              <div><dt className="font-semibold">Locations</dt><dd className="mt-1 font-mono text-sm">{panel.locations.join(', ')}</dd></div>
              <div><dt className="font-semibold">Events</dt><dd className="mt-1 font-mono text-sm">{panel.events.join(', ')}</dd></div>
              <div><dt className="font-semibold">Contract</dt><dd className="mt-1">{panel.contract}</dd></div>
            </dl>
            <ul className="mt-4 space-y-2">{panel.notes.map((note) => <li key={note}>{note}</li>)}</ul>
            <p className="mt-4 text-sm text-muted-foreground">Source: <a href={panel.sourceUrl}>{panel.sourceTitle}</a></p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PolicyCoreSection(): VNode {
  return (
    <section id="policy-core" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">7. Policy Core Pattern</h2>
      <p className="text-lg text-muted-foreground mb-6">Put reusable decisions in a pure policy core and keep provider adapters thin.</p>
      <p>A pure policy core takes normalized input and returns a deterministic decision. It does not read environment variables, shell out, call external APIs, or print progress. Provider adapters own I/O, schema translation, exit codes, and provider-specific response formats.</p>
      <CodeBlock code={codeSamples.policyCore ?? ''} language="javascript" filename="policy-core.mjs" className="my-6" />
      <CodeBlock code={codeSamples.codexHook ?? ''} language="json" filename=".codex/hooks.json" className="my-6" />
      <CodeBlock code={codeSamples.codexAdapter ?? ''} language="javascript" filename=".codex/hooks/policy.mjs" className="my-6" />
    </section>
  )
}

export function SafeIntegrationsSection(): VNode {
  return (
    <section id="safe-integrations" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">8. Safe Integrations</h2>
      <p className="text-lg text-muted-foreground mb-6">Hooks often sit next to shell commands, secrets, and external systems, so they need stricter defaults than ordinary scripts.</p>
      <ul className="my-6 space-y-3">
        <li><strong>Shell injection:</strong> pass arguments as arrays and avoid shell interpolation for untrusted input.</li>
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
      <h2 className="text-3xl font-bold mb-4">9. Testing Hooks</h2>
      <p className="text-lg text-muted-foreground mb-6">Every example hook should have a fixture test and a host-level smoke test.</p>
      <p>Fixture tests prove the policy core handles known provider payloads. Smoke tests prove the provider adapter can read stdin, emit the expected output, and return the expected exit status in the host environment.</p>
      <CodeTabs files={[{ path: 'policy-core.test.ts', content: codeSamples.fixtureTest ?? '', language: 'typescript' }, { path: 'smoke-test.sh', content: codeSamples.smokeTest ?? '', language: 'bash' }]} className="my-6" />
    </section>
  )
}

export function WhenNotHooksSection(): VNode {
  return (
    <section id="when-not-hooks" className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold mb-4">10. When Not To Use Hooks</h2>
      <p className="text-lg text-muted-foreground mb-6">Hooks are powerful because they run automatically, which also makes them easy to overuse.</p>
      <ul className="my-6 space-y-3">
        <li>Do not use a hook for guidance that belongs in <code>AGENTS.md</code>, <code>CLAUDE.md</code>, or another instruction file.</li>
        <li>Do not use a hook when a skill or slash command is a better human-invoked workflow boundary.</li>
        <li>Do not call slow external systems on every tool invocation; batch, throttle, or move that work to session boundaries.</li>
        <li>Do not silently rewrite user intent. Block with a clear message instead.</li>
        <li>Do not make hooks the only copy of business-critical policy. Keep the policy documented and reviewable.</li>
      </ul>
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
