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
  /** Cursor implementation */
  cursor: ProviderSupport
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
    cursor: {
      level: 'full',
      implementation: 'MCP servers with stdio, SSE, and HTTP transports',
      location: '.cursor/mcp.json',
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
    cursor: {
      level: 'full',
      implementation: 'Project instructions file',
      location: '.cursor/instructions.md',
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
    cursor: {
      level: 'full',
      implementation: 'User-level settings and preferences',
      location: '~/.cursor/settings.json',
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
    cursor: {
      level: 'full',
      implementation: 'Rules with path patterns',
      location: '.cursor/rules/*.md',
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
  },
  {
    primitiveId: 'hooks',
    primitiveName: 'Lifecycle Hooks',
    copilot: {
      level: 'full',
      implementation: 'Lifecycle hooks (public documentation coming soon)',
      location: '.github/hooks/*.json',
    },
    claude: {
      level: 'full',
      implementation: 'PreToolUse, PostToolUse, Stop hooks with matchers',
      location: '.claude/hooks/hooks.json',
    },
    cursor: {
      level: 'full',
      implementation: 'Session, execution, and file operation hooks',
      location: '.cursor/hooks.json',
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
