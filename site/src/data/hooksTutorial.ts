import type { TocItem } from '@/components/TableOfContents'

export interface HookEvent {
  normalized: string
  purpose: string
  copilot: string
  claude: string
  codex: string
}

export interface ProviderHookPanel {
  provider: string
  scope: string
  locations: readonly string[]
  events: readonly string[]
  contract: string
  notes: readonly string[]
  sourceTitle: string
  sourceUrl: string
}

export interface FurtherReadingLink {
  title: string
  url: string
  source: string
  description: string
}

export const tocItems: readonly TocItem[] = [
  { id: 'when-hooks', label: '1. When Hooks Fit', level: 'beginner' },
  { id: 'lifecycle-model', label: '2. Lifecycle Model', level: 'beginner' },
  { id: 'contract-model', label: '3. Contract Model', level: 'intermediate' },
  { id: 'first-provider-hook', label: '4. First Provider Hook', level: 'intermediate' },
  { id: 'provider-panels', label: '5. Provider Panels', level: 'intermediate' },
  { id: 'policy-core', label: '6. Policy Core Pattern', level: 'advanced' },
  { id: 'safe-integrations', label: '7. Safe Integrations', level: 'advanced' },
  { id: 'testing-hooks', label: '8. Testing Hooks', level: 'advanced' },
  { id: 'when-not-hooks', label: '9. When Not To Use Hooks' },
] as const

export const normalizedEvents: readonly HookEvent[] = [
  {
    normalized: 'Session start',
    purpose: 'Initialize state, print concise context, or validate local prerequisites before work begins.',
    copilot: 'sessionStart',
    claude: 'SessionStart',
    codex: 'SessionStart',
  },
  {
    normalized: 'User prompt submitted',
    purpose: 'Inspect or enrich a new prompt before the agent plans work.',
    copilot: 'userPromptSubmitted',
    claude: 'UserPromptSubmit',
    codex: 'UserPromptSubmit',
  },
  {
    normalized: 'Before tool use',
    purpose: 'Allow, block, rewrite, or require approval before a tool side effect happens.',
    copilot: 'preToolUse',
    claude: 'PreToolUse',
    codex: 'PreToolUse',
  },
  {
    normalized: 'After tool use',
    purpose: 'Record results, update compact state, or run postconditions after a successful tool call.',
    copilot: 'postToolUse',
    claude: 'PostToolUse',
    codex: 'PostToolUse',
  },
  {
    normalized: 'Tool failure',
    purpose: 'Surface diagnostics or recovery guidance after a tool call fails.',
    copilot: 'postToolUseFailure',
    claude: 'PostToolUseFailure',
    codex: 'PostToolUse',
  },
  {
    normalized: 'Compaction',
    purpose: 'Persist or restore compact state around context compaction.',
    copilot: 'No direct equivalent',
    claude: 'PreCompact',
    codex: 'PreCompact, PostCompact',
  },
  {
    normalized: 'Agent stop',
    purpose: 'Finalize state, clean temporary locks, or report completion once the agent stops.',
    copilot: 'agentStop, subagentStop',
    claude: 'Stop, SubagentStop',
    codex: 'Stop, SubagentStop',
  },
] as const

export const providerPanels: readonly ProviderHookPanel[] = [
  {
    provider: 'GitHub Copilot',
    scope: 'Repository hooks apply to Copilot agents in that repository; personal hooks apply to Copilot CLI.',
    locations: ['.github/hooks/*.json', '~/.copilot/hooks/*.json'],
    events: ['sessionStart', 'sessionEnd', 'userPromptSubmitted', 'preToolUse', 'postToolUse', 'postToolUseFailure', 'errorOccurred', 'agentStop', 'subagentStop'],
    contract: 'Copilot hook commands receive event payloads from the agent runtime and use structured output plus process exit status to decide whether to continue, block, or add guidance.',
    notes: [
      'Use Copilot hooks as the primary worked implementation when your repository already standardizes on AGENTS.md and GitHub-native automation.',
      'Keep repository hooks deterministic and reviewable because they are versioned with the project.',
      'Remember that Copilot command hook timeouts are always fail-open, even for preToolUse and administrator policy hooks.',
      'Treat personal hooks as local workflow glue, not as team policy.',
    ],
    sourceTitle: 'GitHub Copilot hooks reference',
    sourceUrl: 'https://docs.github.com/en/copilot/reference/hooks-reference',
  },
  {
    provider: 'Claude Code',
    scope: 'Hooks live inside settings files at project, local project, and user scope.',
    locations: ['.claude/settings.json', '.claude/settings.local.json', '~/.claude/settings.json'],
    events: ['PreToolUse', 'PostToolUse', 'PostToolUseFailure', 'UserPromptSubmit', 'Stop', 'SubagentStop', 'PreCompact', 'SessionStart', 'SessionEnd'],
    contract: 'Claude hooks are configured as matcher/command entries in settings. Hook commands receive JSON on stdin and can block, approve, or add context depending on the event and response.',
    notes: [
      'Use Claude hooks as the secondary mapping because the lifecycle model is similar but the configuration file is settings-based rather than a dedicated hooks directory.',
      'Cloud sessions do not read local user settings; repository and managed settings are the portable surfaces.',
      'Prefer shared project settings for team policy and local settings for personal automation.',
    ],
    sourceTitle: 'Claude Code hooks documentation',
    sourceUrl: 'https://code.claude.com/docs/en/hooks',
  },
  {
    provider: 'OpenAI Codex',
    scope: 'Hooks can be configured in repository or user hooks files and in config.toml.',
    locations: ['<repo>/.codex/hooks.json', '~/.codex/hooks.json', '<repo>/.codex/config.toml', '~/.codex/config.toml'],
    events: ['SessionStart', 'SessionEnd', 'SubagentStart', 'SubagentStop', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'PermissionRequest', 'PreCompact', 'PostCompact', 'Stop'],
    contract: 'Codex hooks use a top-level hooks map in hooks.json or equivalent config entries. Matching hooks from multiple files can run, and non-managed hooks must be reviewed and trusted first.',
    notes: [
      'Use Codex as a compatibility check when designing a vendor-neutral policy core because it exposes compaction and permission request events explicitly.',
      'Remember that SessionEnd does not run for subagents.',
      'Keep hook files minimal and push reusable logic into scripts that can be fixture tested.',
    ],
    sourceTitle: 'OpenAI Codex hooks documentation',
    sourceUrl: 'https://developers.openai.com/codex/hooks',
  },
] as const

export const furtherReadingLinks: readonly FurtherReadingLink[] = [
  {
    title: 'GitHub Copilot hooks',
    url: 'https://docs.github.com/en/copilot/concepts/agents/hooks',
    source: 'GitHub Docs',
    description: 'Conceptual overview for Copilot repository and personal hooks.',
  },
  {
    title: 'GitHub Copilot hooks reference',
    url: 'https://docs.github.com/en/copilot/reference/hooks-reference',
    source: 'GitHub Docs',
    description: 'Lifecycle events, input/output contracts, and hook examples for Copilot.',
  },
  {
    title: 'Claude Code hooks',
    url: 'https://code.claude.com/docs/en/hooks',
    source: 'Anthropic',
    description: 'Official settings schema, lifecycle events, and hook behavior for Claude Code.',
  },
  {
    title: 'OpenAI Codex hooks',
    url: 'https://developers.openai.com/codex/hooks',
    source: 'OpenAI',
    description: 'Codex hook locations, events, review model, and hooks.json schema.',
  },
] as const

export const codeSamples: Record<string, string> = {
  normalizedPayload: `{
  "provider": "copilot",
  "event": "preToolUse",
  "normalizedEvent": "before_tool_use",
  "tool": {
    "name": "bash",
    "input": {
      "command": "git push --force"
    }
  },
  "scope": {
    "repository": "example/app",
    "cwd": "/workspace/app"
  }
}`,

  hookDecision: `{
  "decision": "block",
  "message": "Git push is disabled for agent runs. Ask for human approval first.",
  "diagnostics": [
    {
      "severity": "error",
      "code": "git_push_blocked"
    }
  ]
}`,

  copilotHook: `{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "node .github/hooks/policy.mjs",
        "timeoutSec": 30
      }
    ]
  }
}`,

  claudeHook: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/adapter.mjs"
          }
        ]
      }
    ]
  }
}`,

  codexHook: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \\"$(git rev-parse --show-toplevel)/.codex/hooks/policy.mjs\\"",
            "statusMessage": "Checking Bash command"
          }
        ]
      }
    ]
  }
}`,

  claudeAdapter: `import { Buffer } from 'node:buffer'
import { evaluatePolicy } from './policy-core.mjs'

const chunks = []
for await (const chunk of process.stdin) {
  chunks.push(chunk)
}

const input = Buffer.concat(chunks).toString('utf8')
const payload = JSON.parse(input)
const event = {
  normalizedEvent: payload.hook_event_name === 'PreToolUse'
    ? 'before_tool_use'
    : payload.hook_event_name,
  tool: {
    name: payload.tool_name,
    input: payload.tool_input,
  },
}

const decision = evaluatePolicy(event)

if (decision.decision === 'block') {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: decision.message,
    },
  }))
} else {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'allow',
    },
  }))
}`,

  codexAdapter: `import { Buffer } from 'node:buffer'
import { evaluatePolicy } from './policy-core.mjs'

const chunks = []
for await (const chunk of process.stdin) {
  chunks.push(chunk)
}

const input = Buffer.concat(chunks).toString('utf8')
const payload = JSON.parse(input)
const event = {
  normalizedEvent: payload.hook_event_name === 'PreToolUse'
    ? 'before_tool_use'
    : payload.hook_event_name,
  tool: {
    name: payload.tool_name,
    input: payload.tool_input,
  },
}

const decision = evaluatePolicy(event)

if (decision.decision === 'block') {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: decision.message,
    },
  }))
} else {
  console.log(JSON.stringify({ systemMessage: 'Policy hook allowed the tool call.' }))
}`,

  policyCore: `function tokenizeCommand(command) {
  return command.match(/"[^"]*"|'[^']*'|\\S+/g)?.map((token) => token.replace(/^["']|["']$/g, '')) ?? []
}

export function commandContainsGitPush(input) {
  const command = typeof input === 'string'
    ? input
    : input != null && typeof input === 'object' && typeof input.command === 'string'
      ? input.command
      : null

  if (command == null) {
    return false
  }

  const tokens = tokenizeCommand(command)
  const gitIndex = tokens.findIndex((token) => token === 'git' || token.endsWith('/git'))
  if (gitIndex === -1) {
    return false
  }

  const args = tokens.slice(gitIndex + 1)
  const pushIndex = args.findIndex((token) => !token.startsWith('-') && token === 'push')
  if (pushIndex === -1) {
    return false
  }

  return true
}

export function normalizeCopilotEvent(input) {
  return {
    normalizedEvent: input.event === 'preToolUse' || input.hook_event_name === 'PreToolUse' || input.toolName != null || input.tool_name != null
      ? 'before_tool_use'
      : input.event ?? 'before_tool_use',
    tool: {
      name: input.toolName ?? input.tool_name,
      input: input.toolArgs ?? input.tool_input,
    },
  }
}

export function evaluatePolicy(event) {
  if (event.normalizedEvent !== 'before_tool_use') {
    return { decision: 'allow' }
  }

  if (event.tool?.name === 'bash' || event.tool?.name === 'Bash') {
    if (commandContainsGitPush(event.tool.input)) {
      return {
        decision: 'block',
        message: 'Git push is disabled for agent runs. Ask for human approval first.',
      }
    }
  }

  return { decision: 'allow' }
}`,

  copilotAdapter: `import { Buffer } from 'node:buffer'
import { evaluatePolicy, normalizeCopilotEvent } from './policy-core.mjs'

const chunks = []
for await (const chunk of process.stdin) {
  chunks.push(chunk)
}

const input = Buffer.concat(chunks).toString('utf8')
const event = normalizeCopilotEvent(JSON.parse(input))
const decision = evaluatePolicy(event)

if (decision.decision === 'block') {
  console.log(JSON.stringify({
    permissionDecision: 'deny',
    permissionDecisionReason: decision.message,
  }))
} else {
  console.log(JSON.stringify({ permissionDecision: 'allow' }))
}`,

  fixtureTest: `import { describe, expect, it } from 'bun:test'
import { evaluatePolicy, normalizeCopilotEvent } from '../policy-core.mjs'

describe('hook policy', () => {
  const blockedDecision = {
    decision: 'block',
    message: 'Git push is disabled for agent runs. Ask for human approval first.',
  }

  it('blocks git push commands before tool use', () => {
    const pushFixture = {
      event: 'preToolUse',
      toolName: 'bash',
      toolArgs: {
        command: 'git push origin main',
      },
    }

    const decision = evaluatePolicy(normalizeCopilotEvent(pushFixture))

    expect(decision).toEqual(blockedDecision)
  })

  it('blocks force-option spellings assembled by the shell', () => {
    const bypassFixtures = [
      {
        event: 'preToolUse',
        toolName: 'bash',
        toolArgs: {
          command: 'git push --for"ce" origin main',
        },
      },
      {
        event: 'preToolUse',
        toolName: 'bash',
        toolArgs: {
          command: 'git push --for\\\\ce origin main',
        },
      },
    ]

    for (const fixture of bypassFixtures) {
      const decision = evaluatePolicy(normalizeCopilotEvent(fixture))

      expect(decision).toEqual(blockedDecision)
    }
  })
})`,

  smokeTest: `output=$(printf '%s\\n' '{"event":"preToolUse","toolName":"bash","toolArgs":{"command":"git push -f origin main"}}' \\
  | node .github/hooks/policy.mjs)

test "$?" -eq 0
node -e 'const out = JSON.parse(process.argv[1]); if (out.permissionDecision !== "deny") process.exit(1)' "$output"`,

  safeShell: `import { spawn } from 'node:child_process'

spawn('/usr/bin/git', ['status', '--short'], {
  cwd: repositoryPath,
  shell: false,
  stdio: ['ignore', 'pipe', 'pipe'],
})`,
}
