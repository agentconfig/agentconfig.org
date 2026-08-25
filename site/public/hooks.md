# Hooks Tutorial

Tutorial for designing, testing, and mapping lifecycle hooks across provider runtimes.
Covers a vendor-neutral contract model, Copilot and Claude worked implementations,
provider panels, safety guidance, and fixture-driven tests.

## Tutorial Sections

- 1. When Hooks Fit (beginner)
- 2. Lifecycle Model (beginner)
- 3. Contract Model (intermediate)
- 4. First Copilot Hook (intermediate)
- 5. First Claude Hook (intermediate)
- 6. Provider Panels (intermediate)
- 7. Policy Core Pattern (advanced)
- 8. Safe Integrations (advanced)
- 9. Testing Hooks (advanced)
- 10. When Not To Use Hooks

## Section Details

### 1. When Hooks Fit

Hooks are deterministic code that runs at defined points in an agent session. Use hooks
when you need machine-enforced policy, repeatable side effects, compact progress updates,
or runtime gates around tool calls. Use instructions for judgment guidance, skills for
human-invoked procedures, and MCP when the agent needs a new tool.

Good hook jobs:
- Gate risky commands such as force-push, production deploys, secret reads, and destructive migrations.
- Publish compact progress only when objective, phase, blocker, or attention changes.
- Preserve continuity before compaction and recover it at session start.
- Keep local audit trails for tool decisions without exposing private data externally.

### 2. Lifecycle Model

Normalize provider event names into the lifecycle your policy cares about:

| Normalized event | Use it for | Copilot | Claude | Codex |
| --- | --- | --- | --- | --- |
| Session start | Initialize state, print concise context, or validate local prerequisites before work begins. | sessionStart | SessionStart | SessionStart |
| User prompt submitted | Inspect or enrich a new prompt before the agent plans work. | userPromptSubmitted | UserPromptSubmit | UserPromptSubmit |
| Before tool use | Allow, block, rewrite, or require approval before a tool side effect happens. | preToolUse | PreToolUse | PreToolUse |
| After tool use | Record results, update compact state, or run postconditions after a successful tool call. | postToolUse | PostToolUse | PostToolUse |
| Tool failure | Surface diagnostics or recovery guidance after a tool call fails. | postToolUseFailure | PostToolUseFailure | PostToolUse |
| Compaction | Persist or restore compact state around context compaction. | No direct equivalent | PreCompact | PreCompact, PostCompact |
| Agent stop | Finalize state, clean temporary locks, or report completion once the agent stops. | agentStop, subagentStop | Stop, SubagentStop | Stop, SubagentStop |

### 3. Contract Model

A durable hook contract has four parts: JSON input, structured output, an exit-code policy,
and diagnostics. Keep human-readable logs separate from the final machine-readable decision.

**Normalized payload:**
```json
{
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
}
```

**Decision payload:**
```json
{
  "decision": "block",
  "message": "Git push is disabled for agent runs. Ask for human approval first.",
  "diagnostics": [
    {
      "severity": "error",
      "code": "git_push_blocked"
    }
  ]
}
```

### 4. First Copilot Hook

Copilot repository hooks live under `.github/hooks/`. Put provider configuration in a small
JSON file and keep real policy in a script that can be tested outside the agent runtime.

```json
{
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
}
```

```typescript
import { Buffer } from 'node:buffer'
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
}
```

### 5. First Claude Hook

Claude hooks are configured inside settings files rather than a dedicated hooks directory.
Use shared project settings for team policy and local settings for personal automation.

```json
{
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
}
```

```javascript
import { Buffer } from 'node:buffer'
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
}
```

### 6. Provider Panels

These panels are grounded in the provider documentation snapshots used by the documentation
refresh skill.

#### GitHub Copilot

**Scope:** Repository hooks apply to Copilot agents in that repository; personal hooks apply to Copilot CLI.

**Locations:** `.github/hooks/*.json`, `~/.copilot/hooks/*.json`

**Events:** `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `errorOccurred`, `agentStop`, `subagentStop`

**Contract:** Copilot hook commands receive event payloads from the agent runtime and use structured output plus process exit status to decide whether to continue, block, or add guidance.

- Use Copilot hooks as the primary worked implementation when your repository already standardizes on AGENTS.md and GitHub-native automation.
- Keep repository hooks deterministic and reviewable because they are versioned with the project.
- Remember that Copilot command hook timeouts are always fail-open, even for preToolUse and administrator policy hooks.
- Treat personal hooks as local workflow glue, not as team policy.

Source: [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)

#### Claude Code

**Scope:** Hooks live inside settings files at project, local project, and user scope.

**Locations:** `.claude/settings.json`, `.claude/settings.local.json`, `~/.claude/settings.json`

**Events:** `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `UserPromptSubmit`, `Stop`, `SubagentStop`, `PreCompact`, `SessionStart`, `SessionEnd`

**Contract:** Claude hooks are configured as matcher/command entries in settings. Hook commands receive JSON on stdin and can block, approve, or add context depending on the event and response.

- Use Claude hooks as the secondary mapping because the lifecycle model is similar but the configuration file is settings-based rather than a dedicated hooks directory.
- Cloud sessions do not read local user settings; repository and managed settings are the portable surfaces.
- Prefer shared project settings for team policy and local settings for personal automation.

Source: [Claude Code hooks documentation](https://code.claude.com/docs/en/hooks)

#### OpenAI Codex

**Scope:** Hooks can be configured in repository or user hooks files and in config.toml.

**Locations:** `<repo>/.codex/hooks.json`, `~/.codex/hooks.json`, `<repo>/.codex/config.toml`, `~/.codex/config.toml`

**Events:** `SessionStart`, `SessionEnd`, `SubagentStart`, `SubagentStop`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, `PreCompact`, `PostCompact`, `Stop`

**Contract:** Codex hooks use a top-level hooks map in hooks.json or equivalent config entries. Matching hooks from multiple files can run, and non-managed hooks must be reviewed and trusted first.

- Use Codex as a compatibility check when designing a vendor-neutral policy core because it exposes compaction and permission request events explicitly.
- Remember that SessionEnd does not run for subagents.
- Keep hook files minimal and push reusable logic into scripts that can be fixture tested.

Source: [OpenAI Codex hooks documentation](https://developers.openai.com/codex/hooks)


### 7. Policy Core Pattern

Put reusable decisions in a pure policy core and keep provider adapters thin. The policy core
takes normalized input and returns a deterministic decision. Provider adapters own I/O, schema
translation, exit codes, and provider-specific response formats.

```typescript
function tokenizeCommand(command) {
  return command.match(/"[^"]*"|'[^']*'|\S+/g)?.map((token) => token.replace(/^["']|["']$/g, '')) ?? []
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
}
```

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$(git rev-parse --show-toplevel)/.codex/hooks/policy.mjs\"",
            "statusMessage": "Checking Bash command"
          }
        ]
      }
    ]
  }
}
```

```javascript
import { Buffer } from 'node:buffer'
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
}
```

### 8. Safe Integrations

Hooks often sit next to shell commands, secrets, and external systems, so they need stricter
defaults than ordinary scripts.

- Shell injection: pass arguments as arrays and avoid shell interpolation for untrusted input.
- Shell parsing: do not infer force-push arguments from raw shell text. The example policy blocks every detected git push; use a real shell parser or server-side branch protection when normal pushes must remain available.
- Secrets: never echo tokens, never put credentials in hook config, and redact environment-derived values from diagnostics.
- Untrusted content: treat retrieved documents, tool output, and user prompts as data, not hook instructions.
- Data egress: fail closed before sending repository, user, or customer data externally unless policy allows it.
- Unavailable services: fail open for optional telemetry, fail closed for policy gates, and test both choices.
- Copilot timeouts: command hook timeouts are always fail-open, even for preToolUse and administrator policy hooks; use small timeouts and make policy-critical checks fast.

```typescript
import { spawn } from 'node:child_process'

spawn('/usr/bin/git', ['status', '--short'], {
  cwd: repositoryPath,
  shell: false,
  stdio: ['ignore', 'pipe', 'pipe'],
})
```

### 9. Testing Hooks

Every example hook should have a fixture test and a host-level smoke test.

**Fixture test:**
```typescript
import { describe, expect, it } from 'bun:test'
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
          command: 'git push --for\\ce origin main',
        },
      },
    ]

    for (const fixture of bypassFixtures) {
      const decision = evaluatePolicy(normalizeCopilotEvent(fixture))

      expect(decision).toEqual(blockedDecision)
    }
  })
})
```

**Smoke test:**
```bash
output=$(printf '%s\n' '{"event":"preToolUse","toolName":"bash","toolArgs":{"command":"git push -f origin main"}}' \
  | node .github/hooks/policy.mjs)

test "$?" -eq 0
node -e 'const out = JSON.parse(process.argv[1]); if (out.permissionDecision !== "deny") process.exit(1)' "$output"
```

### 10. When Not To Use Hooks

- Do not use a hook for guidance that belongs in AGENTS.md, CLAUDE.md, or another instruction file.
- Do not use a hook when a skill or slash command is a better human-invoked workflow boundary.
- Do not call slow external systems on every tool invocation; batch, throttle, or move that work to session boundaries.
- Do not silently rewrite user intent. Block with a clear message instead.
- Do not make hooks the only copy of business-critical policy. Keep the policy documented and reviewable.

## Further Reading

- [GitHub Copilot hooks](https://docs.github.com/en/copilot/concepts/agents/hooks): Conceptual overview for Copilot repository and personal hooks.
- [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference): Lifecycle events, input/output contracts, and hook examples for Copilot.
- [Claude Code hooks](https://code.claude.com/docs/en/hooks): Official settings schema, lifecycle events, and hook behavior for Claude Code.
- [OpenAI Codex hooks](https://developers.openai.com/codex/hooks): Codex hook locations, events, review model, and hooks.json schema.
