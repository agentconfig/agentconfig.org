export type SupportLevel = 'full' | 'partial' | 'none'

export interface ProviderSupport {
  /** Support level */
  level: SupportLevel
  /** How it's implemented */
  implementation: string
  /** File location or feature name */
  location: string
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
    codex: {
      level: 'full',
      implementation: 'Local coding agent with multi-step execution',
      location: 'Codex CLI / Editor extensions',
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
    codex: {
      level: 'partial',
      implementation: 'Workflow definitions via AGENTS.md',
      location: 'AGENTS.md (project-level)',
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
      location: '.claude/settings.json',
    },
    codex: {
      level: 'full',
      implementation: 'MCP servers configured in config.toml',
      location: '~/.codex/config.toml',
    },
  },
  // === CUSTOMIZATION ===
  {
    primitiveId: 'persistent-instructions',
    primitiveName: 'Persistent Instructions',
    copilot: {
      level: 'full',
      implementation: 'Repo instructions file',
      location: '.github/copilot-instructions.md',
    },
    claude: {
      level: 'full',
      implementation: 'Project memory file with @imports',
      location: 'CLAUDE.md',
    },
    codex: {
      level: 'full',
      implementation: 'Project instructions via AGENTS.md',
      location: 'AGENTS.md (project-level)',
    },
  },
  {
    primitiveId: 'global-instructions',
    primitiveName: 'Global Instructions',
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
    codex: {
      level: 'full',
      implementation: 'Global configuration and settings',
      location: '~/.codex/config.toml',
    },
  },
  {
    primitiveId: 'scope-specific-instructions',
    primitiveName: 'Path-Scoped Rules',
    copilot: {
      level: 'full',
      implementation: 'Instruction files with applyTo glob patterns',
      location: '.github/instructions/*.instructions.md',
    },
    claude: {
      level: 'full',
      implementation: 'Rule files with globs frontmatter',
      location: '.claude/rules/*.md',
    },
    codex: {
      level: 'none',
      implementation: 'Not natively supported',
      location: 'N/A',
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
    codex: {
      level: 'partial',
      implementation: 'CLI-based commands and workflows',
      location: '~/.codex/config.toml or AGENTS.md',
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
    codex: {
      level: 'partial',
      implementation: 'Agent role presets and configurations',
      location: 'AGENTS.md with role definitions',
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
    codex: {
      level: 'full',
      implementation: 'Approval policies and sandbox settings',
      location: '~/.codex/config.toml',
    },
  },
  {
    primitiveId: 'hooks',
    primitiveName: 'Lifecycle Hooks',
    copilot: {
      level: 'none',
      implementation: 'Not available',
      location: 'N/A',
    },
    claude: {
      level: 'full',
      implementation: 'PreToolUse, PostToolUse, Stop hooks with matchers',
      location: '.claude/hooks/hooks.json',
    },
    codex: {
      level: 'partial',
      implementation: 'MCP server callbacks for tool lifecycle',
      location: '~/.codex/config.toml (MCP config)',
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
    codex: {
      level: 'partial',
      implementation: 'Metrics and observability for agent runs',
      location: '~/.codex/config.toml (metrics config)',
    },
  },
]

export const supportLevelLabels: Record<SupportLevel, string> = {
  full: 'Full Support',
  partial: 'Partial',
  none: 'Not Available',
}

export const supportLevelColors: Record<SupportLevel, string> = {
  full: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  partial: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  none: 'bg-gray-500/10 text-gray-500 dark:text-gray-400',
}

export const supportLevelIcons: Record<SupportLevel, string> = {
  full: '✓',
  partial: '◐',
  none: '—',
}
