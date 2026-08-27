import type { Provider } from './primitives'

export interface StarterExample {
  readonly code: string
  readonly language: string
  readonly filename?: string
}

const sharedAgentsExample = `# Project instructions

## Commands
- Install: \`bun install\`
- Test: \`bun test\`
- Build: \`bun run build\`

## Conventions
- Use TypeScript strict mode
- Run tests before committing`

export const instructionStarterExamples = {
  copilot: {
    filename: 'AGENTS.md',
    language: 'markdown',
    code: sharedAgentsExample,
  },
  claude: {
    filename: 'CLAUDE.md',
    language: 'markdown',
    code: `@AGENTS.md

## Claude Code

Put shared project instructions in AGENTS.md.
Add only Claude-specific guidance here.`,
  },
  cursor: {
    filename: 'AGENTS.md',
    language: 'markdown',
    code: sharedAgentsExample,
  },
  codex: {
    filename: 'AGENTS.md',
    language: 'markdown',
    code: sharedAgentsExample,
  },
} satisfies Record<Provider, StarterExample>

const sharedSkillExample = `---
name: explain-failure
description: Explain a failing test and suggest the smallest fix. Use when a test fails.
---

# Explain Failure

1. Read the failing test and its output.
2. Identify the first incorrect assumption.
3. Suggest the smallest safe fix.
4. Name the command that verifies the fix.`

export const skillStarterExamples = {
  copilot: {
    filename: '.github/skills/explain-failure/SKILL.md',
    language: 'markdown',
    code: sharedSkillExample,
  },
  claude: {
    filename: '.claude/skills/explain-failure/SKILL.md',
    language: 'markdown',
    code: sharedSkillExample,
  },
  cursor: {
    filename: '.cursor/skills/explain-failure/SKILL.md',
    language: 'markdown',
    code: sharedSkillExample,
  },
  codex: {
    filename: '.agents/skills/explain-failure/SKILL.md',
    language: 'markdown',
    code: sharedSkillExample,
  },
} satisfies Record<Provider, StarterExample>

export const mcpStarterExamples = {
  copilot: {
    filename: '.vscode/mcp.json',
    language: 'json',
    code: `{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}`,
  },
  claude: {
    filename: 'Terminal',
    language: 'bash',
    code: `claude mcp add --transport http github https://api.githubcopilot.com/mcp/
claude mcp list`,
  },
  cursor: {
    filename: '.cursor/mcp.json',
    language: 'json',
    code: `{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}`,
  },
  codex: {
    filename: '.codex/config.toml',
    language: 'toml',
    code: `[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"`,
  },
} satisfies Record<Provider, StarterExample>
