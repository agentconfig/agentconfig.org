export type SupportLevel = 'full' | 'partial' | 'none'

export interface ProviderSupport {
  /** Support level */
  level: SupportLevel
  /** How it's implemented */
  implementation: string
  /** File location or feature name */
  location: string
  /** Primary provider documentation */
  sourceUrl?: string
}

export interface ComparisonRow {
  /** Primitive ID (matches primitives.ts) */
  primitiveId: string
  /** Primitive display name */
  primitiveName: string
  /** GitHub Copilot implementation */
  copilot: ProviderSupport
  /** Claude Code implementation */
  claude: ProviderSupport
  /** Cursor implementation */
  cursor: ProviderSupport
  /** OpenAI Codex implementation */
  codex: ProviderSupport
}

export const comparisonData: ComparisonRow[] = [
  // === CAPABILITY ===
  {
    primitiveId: 'agent-mode',
    primitiveName: 'Agent Mode',
    copilot: {
      level: 'full',
      implementation: 'Agent mode in Copilot Chat',
      location: 'VS Code Copilot Chat',
    },
    claude: {
      level: 'full',
      implementation: 'Agentic workflows in Claude Code',
      location: 'Claude Code CLI',
    },
    cursor: {
      level: 'full',
      implementation: 'Cursor Agent mode for multi-step execution',
      location: 'Cursor Editor with Agent capabilities',
    },
    codex: {
      level: 'full',
      implementation: 'Agentic coding with multi-step execution',
      location: 'Codex CLI',
    },
  },
  {
    primitiveId: 'skills',
    primitiveName: 'Skills / Workflows',
    copilot: {
      level: 'full',
      implementation: 'Skill modules in skills directory',
      location: '.github/skills/*/SKILL.md',
    },
    claude: {
      level: 'full',
      implementation: 'Skill modules in .claude directory',
      location: '.claude/skills/*/SKILL.md',
    },
    cursor: {
      level: 'full',
      implementation: 'Skill modules as portable, reusable packages',
      location: '.cursor/skills/*/SKILL.md',
    },
    codex: {
      level: 'full',
      implementation: 'Skill modules following agentskills.io specification',
      location: '.codex/skills/*/SKILL.md',
    },
  },
  {
    primitiveId: 'tool-integrations',
    primitiveName: 'Tool Integrations (MCP)',
    copilot: {
      level: 'full',
      implementation: 'MCP servers and tool calling',
      location: 'VS Code MCP settings',
    },
    claude: {
      level: 'full',
      implementation: 'MCP servers and tool calling',
      location: '.mcp.json or ~/.claude.json',
      sourceUrl: 'https://code.claude.com/docs/en/mcp',
    },
    cursor: {
      level: 'full',
      implementation: 'MCP servers with stdio, SSE, and HTTP transports',
      location: '.cursor/mcp.json',
    },
    codex: {
      level: 'full',
      implementation: 'MCP servers with stdio and HTTP transports',
      location: '~/.codex/config.toml',
    },
  },
  // === CUSTOMIZATION ===
  {
    primitiveId: 'persistent-instructions',
    primitiveName: 'Persistent Instructions',
    copilot: {
      level: 'full',
      implementation: 'AGENTS.md or repository instructions file',
      location: 'AGENTS.md or .github/copilot-instructions.md',
      sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
    },
    claude: {
      level: 'full',
      implementation: 'Project memory file with @imports',
      location: 'CLAUDE.md',
    },
    cursor: {
      level: 'full',
      implementation: 'Project instructions file',
      location: '.cursor/instructions.md',
    },
    codex: {
      level: 'full',
      implementation: 'Project AGENTS.md with hierarchical loading',
      location: 'AGENTS.md',
    },
  },
  {
    primitiveId: 'global-instructions',
    primitiveName: 'User Scope Instructions',
    copilot: {
      level: 'full',
      implementation: 'User-level settings in VS Code',
      location: 'VS Code settings.json',
    },
    claude: {
      level: 'full',
      implementation: 'User-level memory and config',
      location: '~/.claude/CLAUDE.md',
    },
    cursor: {
      level: 'full',
      implementation: 'User-level settings and preferences',
      location: '~/.cursor/settings.json',
    },
    codex: {
      level: 'full',
      implementation: 'User-level AGENTS.md and config.toml',
      location: '~/.codex/AGENTS.md',
    },
  },
  {
    primitiveId: 'scope-specific-instructions',
    primitiveName: 'Directory / Path Scope Instructions',
    copilot: {
      level: 'full',
      implementation: 'Nested AGENTS.md or applyTo instruction files',
      location: 'subdir/AGENTS.md or .github/instructions/*.instructions.md',
      sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
    },
    claude: {
      level: 'full',
      implementation: 'Rule files with globs frontmatter',
      location: '.claude/rules/*.md',
    },
    cursor: {
      level: 'full',
      implementation: 'Rules with path patterns',
      location: '.cursor/rules/*.mdc',
      sourceUrl: 'https://cursor.com/docs/context/rules',
    },
    codex: {
      level: 'full',
      implementation: 'Nested AGENTS.md files with hierarchical merge',
      location: 'subdir/AGENTS.md',
    },
  },
  {
    primitiveId: 'prompt-templates',
    primitiveName: 'Slash Commands',
    copilot: {
      level: 'full',
      implementation: 'Prompt files invoked via / commands',
      location: '.github/prompts/*.prompt.md',
    },
    claude: {
      level: 'full',
      implementation: 'Command files with frontmatter and $ARGUMENTS',
      location: '.claude/commands/*.md',
    },
    cursor: {
      level: 'full',
      implementation: 'Custom commands with parameters and reusable workflows',
      location: '.cursor/commands/*.md',
    },
    codex: {
      level: 'full',
      implementation: 'Built-in / commands for session control',
      location: 'Codex CLI / commands',
    },
  },
  // === CONTROL ===
  {
    primitiveId: 'custom-agents',
    primitiveName: 'Custom Agents',
    copilot: {
      level: 'full',
      implementation: 'Agent definition files with roles and tool permissions',
      location: '.github/agents/*.agent.md',
    },
    claude: {
      level: 'full',
      implementation: 'Subagent files with tools restrictions',
      location: '.claude/agents/*.md',
    },
    cursor: {
      level: 'full',
      implementation: 'Subagents with model selection and context isolation',
      location: '.cursor/agents/*.md',
    },
    codex: {
      level: 'full',
      implementation: 'Subagent definitions with model selection and delegation',
      location: '.codex/agents/*.toml, ~/.codex/agents',
    },
  },
  {
    primitiveId: 'guardrails',
    primitiveName: 'Permissions & Guardrails',
    copilot: {
      level: 'full',
      implementation: 'Org policies and tool permissions',
      location: 'VS Code settings + org policies',
    },
    claude: {
      level: 'full',
      implementation: 'Allow/deny lists with pattern matching and sandbox',
      location: '.claude/settings.json',
    },
    cursor: {
      level: 'full',
      implementation: 'Approvals, .cursorignore, LLM safety controls, and security hooks',
      location: '.cursor/settings.json + .cursorignore',
    },
    codex: {
      level: 'full',
      implementation: 'Sandbox modes, approval policies, and .rules files',
      location: '~/.codex/config.toml + ~/.codex/rules/*.rules',
    },
  },
  {
    primitiveId: 'hooks',
    primitiveName: 'Lifecycle Hooks',
    copilot: {
      level: 'full',
      implementation: 'Lifecycle hooks for Copilot CLI and cloud agent',
      location: '.github/hooks/*.json',
      sourceUrl: 'https://docs.github.com/en/copilot/reference/hooks-reference',
    },
    claude: {
      level: 'full',
      implementation: 'Lifecycle hooks configured in shared project settings',
      location: '.claude/settings.json',
      sourceUrl: 'https://code.claude.com/docs/en/hooks',
    },
    cursor: {
      level: 'full',
      implementation: 'Session, execution, and file operation hooks',
      location: '.cursor/hooks.json',
    },
    codex: {
      level: 'full',
      implementation: 'Lifecycle hooks (session, subagent, prompt, tool, compaction events) via hooks.json or config.toml',
      location: '~/.codex/hooks.json, <repo>/.codex/hooks.json, ~/.codex/config.toml, <repo>/.codex/config.toml',
      sourceUrl: 'https://developers.openai.com/codex/hooks',
    },
  },
  {
    primitiveId: 'runtime-sandbox',
    primitiveName: 'Runtime Sandbox',
    copilot: {
      level: 'partial',
      implementation: 'Policy and execution constraints in agent runtime and org settings',
      location: 'Copilot policy/settings surfaces',
      sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall',
    },
    claude: {
      level: 'full',
      implementation: 'Sandboxing and command allow/deny controls',
      location: '.claude/settings.json',
      sourceUrl: 'https://code.claude.com/docs/en/settings',
    },
    cursor: {
      level: 'full',
      implementation: 'Run modes with sandboxing, plus allow/deny permissions',
      location: 'Settings > Agents > Approvals & Execution + .cursor/cli-config.json',
      sourceUrl: 'https://cursor.com/docs/agent/security/run-modes',
    },
    codex: {
      level: 'full',
      implementation: 'Sandbox modes plus approval policies',
      location: '~/.codex/config.toml',
      sourceUrl: 'https://developers.openai.com/codex/config-file/config-reference',
    },
  },
  {
    primitiveId: 'distribution',
    primitiveName: 'Configuration Distribution',
    copilot: {
      level: 'full',
      implementation: 'Repository plus nested AGENTS.md with optional .instructions.md files',
      location: 'AGENTS.md and .github/instructions/*.instructions.md',
      sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
    },
    claude: {
      level: 'full',
      implementation: 'Shared AGENTS.md imported into CLAUDE.md plus scoped rules files',
      location: 'AGENTS.md, CLAUDE.md, .claude/rules/*.md',
      sourceUrl: 'https://code.claude.com/docs/en/memory',
    },
    cursor: {
      level: 'full',
      implementation: 'Project instructions, rules, and reusable skills packages',
      location: '.cursor/instructions.md, .cursor/rules/*.mdc, .cursor/skills/*/SKILL.md',
      sourceUrl: 'https://cursor.com/docs/skills',
    },
    codex: {
      level: 'full',
      implementation: 'Hierarchical AGENTS.md with user+repo layering',
      location: 'AGENTS.md, subdir/AGENTS.md, ~/.codex/AGENTS.md',
      sourceUrl: 'https://developers.openai.com/codex/agent-configuration/agents-md',
    },
  },
  {
    primitiveId: 'verification',
    primitiveName: 'Verification / Evals',
    copilot: {
      level: 'full',
      implementation: 'Run tests/lint via terminal tools',
      location: 'Terminal tools in agent mode',
    },
    claude: {
      level: 'full',
      implementation: 'Run tests/lint via Bash tool with hooks',
      location: 'Bash tool + hooks',
    },
    cursor: {
      level: 'full',
      implementation: 'Integrated terminal for test execution',
      location: 'Cursor Editor integrated terminal',
    },
    codex: {
      level: 'full',
      implementation: 'Shell tool for running tests/lint in agent mode',
      location: 'Codex CLI shell tool',
    },
  },
]

export const supportLevelLabels: Record<SupportLevel, string> = {
  full: 'Full Support',
  partial: 'Partial',
  none: 'Not Available',
}

export const supportLevelColors: Record<SupportLevel, string> = {
  full: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  partial: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  none: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-200',
}

export const supportLevelIcons: Record<SupportLevel, string> = {
  full: '✓',
  partial: '◐',
  none: '—',
}

import type { Provider } from './primitives'

export function getProviderSupport(row: ComparisonRow, providerId: Provider): ProviderSupport {
  return row[providerId]
}
