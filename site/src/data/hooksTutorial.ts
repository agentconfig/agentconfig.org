import type { TocItem } from '@/components/TableOfContents'

export interface HookEvent {
  normalized: string
  purpose: string
  copilot: string
  claude: string
  cursor: string
  codex: string
}

export interface ProviderHookPanel {
  id: 'copilot' | 'claude' | 'cursor' | 'codex'
  label: string
  tone: 'copilot' | 'claude' | 'cursor' | 'codex'
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
  { id: 'first-provider-hook', label: '1. Block One Risky Command', level: 'beginner' },
  { id: 'when-hooks', label: '2. When Hooks Fit', level: 'beginner' },
  { id: 'lifecycle-model', label: '3. Lifecycle Events', level: 'beginner' },
  { id: 'contract-model', label: '4. Hook Contracts', level: 'intermediate' },
  { id: 'provider-panels', label: '5. Providers', level: 'intermediate' },
  { id: 'policy-core', label: '6. Reuse Policy Logic', level: 'advanced' },
  { id: 'safe-integrations', label: '7. Keep Integrations Safe', level: 'advanced' },
  { id: 'testing-hooks', label: '8. Test the Hook', level: 'advanced' },
  { id: 'when-not-hooks', label: '9. Use Another Primitive' },
] as const

export const normalizedEvents: readonly HookEvent[] = [
  {
    normalized: 'Session start',
    purpose: 'Initialize state, print concise context, or validate local prerequisites before work begins.',
    copilot: 'sessionStart',
    claude: 'SessionStart',
    cursor: 'sessionStart',
    codex: 'SessionStart',
  },
  {
    normalized: 'User prompt submitted',
    purpose: 'Inspect or enrich a new prompt before the agent plans work.',
    copilot: 'userPromptSubmitted',
    claude: 'UserPromptSubmit',
    cursor: 'beforeSubmitPrompt',
    codex: 'UserPromptSubmit',
  },
  {
    normalized: 'Before tool use',
    purpose: 'Allow, block, rewrite, or require approval before a tool side effect happens.',
    copilot: 'preToolUse',
    claude: 'PreToolUse',
    cursor: 'preToolUse',
    codex: 'PreToolUse',
  },
  {
    normalized: 'After tool use',
    purpose: 'Record results, update compact state, or run postconditions after a successful tool call.',
    copilot: 'postToolUse',
    claude: 'PostToolUse',
    cursor: 'postToolUse',
    codex: 'PostToolUse',
  },
  {
    normalized: 'Tool failure',
    purpose: 'Surface diagnostics or recovery guidance after a tool call fails.',
    copilot: 'postToolUseFailure',
    claude: 'PostToolUseFailure',
    cursor: 'postToolUseFailure',
    codex: 'PostToolUse',
  },
  {
    normalized: 'Compaction',
    purpose: 'Persist or restore compact state around context compaction.',
    copilot: 'No direct equivalent',
    claude: 'PreCompact',
    cursor: 'preCompact',
    codex: 'PreCompact, PostCompact',
  },
  {
    normalized: 'Agent stop',
    purpose: 'Finalize state, clean temporary locks, or report completion once the agent stops.',
    copilot: 'agentStop, subagentStop',
    claude: 'Stop, SubagentStop',
    cursor: 'stop, subagentStop',
    codex: 'Stop, SubagentStop',
  },
] as const

export const providerPanels: readonly ProviderHookPanel[] = [
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    tone: 'copilot',
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
    id: 'claude',
    label: 'Claude Code',
    tone: 'claude',
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
    id: 'cursor',
    label: 'Cursor',
    tone: 'cursor',
    scope: 'Project hooks apply from .cursor/hooks.json; user hooks apply globally from ~/.cursor/hooks.json. Enterprise plans can also distribute team and managed hooks.',
    locations: ['.cursor/hooks.json', '~/.cursor/hooks.json'],
    events: ['sessionStart', 'sessionEnd', 'preToolUse', 'postToolUse', 'postToolUseFailure', 'subagentStart', 'subagentStop', 'beforeShellExecution', 'afterShellExecution', 'beforeMCPExecution', 'afterMCPExecution', 'beforeReadFile', 'afterFileEdit', 'beforeSubmitPrompt', 'preCompact', 'stop'],
    contract: 'Cursor command hooks receive JSON on stdin and return JSON on stdout. Exit code 0 uses the structured response, exit code 2 blocks the action, and other failures proceed by default.',
    notes: [
      'Use beforeShellExecution when a policy needs the parsed shell command directly; use preToolUse when the same policy should cover every tool.',
      'Project hook commands run from the project root, so repository scripts should use .cursor/hooks/... paths.',
      'Cloud agents run repository, team, and managed command hooks after the environment becomes writable, but they do not load user hooks or IDE-only lifecycle events.',
      'Prompt-based hooks are available locally; cloud agents run command-based hooks only.',
    ],
    sourceTitle: 'Cursor hooks documentation',
    sourceUrl: 'https://cursor.com/docs/hooks',
  },
  {
    id: 'codex',
    label: 'OpenAI Codex',
    tone: 'codex',
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
    title: 'Cursor hooks',
    url: 'https://cursor.com/docs/hooks',
    source: 'Cursor',
    description: 'Official hook locations, lifecycle events, JSON contracts, and cloud-agent limitations.',
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

  cursorHook: `{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      {
        "command": "node .cursor/hooks/policy.mjs"
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

  cursorAdapter: `import { Buffer } from 'node:buffer'

function isGitPush(command) {
  if (typeof command !== 'string') return false

  const tokens = command.match(/"[^"]*"|'[^']*'|\\S+/g) ?? []
  const gitIndex = tokens.findIndex((token) => token === 'git' || token.endsWith('/git'))
  return gitIndex >= 0 && tokens.slice(gitIndex + 1).includes('push')
}

const chunks = []
for await (const chunk of process.stdin) {
  chunks.push(chunk)
}

const input = Buffer.concat(chunks).toString('utf8')
const payload = JSON.parse(input)
if (isGitPush(payload.command)) {
  console.log(JSON.stringify({
    continue: true,
    permission: 'deny',
    user_message: 'Git push is disabled for agent runs.',
    agent_message: 'Ask for human approval before pushing.',
  }))
} else {
  console.log(JSON.stringify({
    continue: true,
    permission: 'allow',
  }))
}`,

  claudeAdapter: `import { Buffer } from 'node:buffer'

function isGitPush(input) {
  const command = typeof input === 'string' ? input : input?.command
  if (typeof command !== 'string') return false

  const tokens = command.match(/"[^"]*"|'[^']*'|\\S+/g) ?? []
  const gitIndex = tokens.findIndex((token) => token === 'git' || token.endsWith('/git'))
  return gitIndex >= 0 && tokens.slice(gitIndex + 1).includes('push')
}

const chunks = []
for await (const chunk of process.stdin) {
  chunks.push(chunk)
}

const input = Buffer.concat(chunks).toString('utf8')
const payload = JSON.parse(input)
if (payload.tool_name === 'Bash' && isGitPush(payload.tool_input)) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: 'Git push is disabled for agent runs.',
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

function isGitPush(input) {
  const command = typeof input === 'string' ? input : input?.command
  if (typeof command !== 'string') return false

  const tokens = command.match(/"[^"]*"|'[^']*'|\\S+/g) ?? []
  const gitIndex = tokens.findIndex((token) => token === 'git' || token.endsWith('/git'))
  return gitIndex >= 0 && tokens.slice(gitIndex + 1).includes('push')
}

const chunks = []
for await (const chunk of process.stdin) {
  chunks.push(chunk)
}

const input = Buffer.concat(chunks).toString('utf8')
const payload = JSON.parse(input)
if (payload.tool_name === 'Bash' && isGitPush(payload.tool_input)) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: 'Git push is disabled for agent runs.',
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

function isGitPush(input) {
  const command = typeof input === 'string' ? input : input?.command
  if (typeof command !== 'string') return false

  const tokens = command.match(/"[^"]*"|'[^']*'|\\S+/g) ?? []
  const gitIndex = tokens.findIndex((token) => token === 'git' || token.endsWith('/git'))
  return gitIndex >= 0 && tokens.slice(gitIndex + 1).includes('push')
}

const chunks = []
for await (const chunk of process.stdin) {
  chunks.push(chunk)
}

const input = Buffer.concat(chunks).toString('utf8')
const payload = JSON.parse(input)

if (payload.toolName === 'bash' && isGitPush(payload.toolArgs)) {
  console.log(JSON.stringify({
    permissionDecision: 'deny',
    permissionDecisionReason: 'Git push is disabled for agent runs.',
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
