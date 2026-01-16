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
  },
  {
    primitiveId: 'tool-integrations',
    primitiveName: 'Tool Integrations',
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
      implementation: 'Project memory file',
      location: 'CLAUDE.md',
    },
  },
  {
    primitiveId: 'scope-specific-instructions',
    primitiveName: 'Scope-Specific Instructions',
    copilot: {
      level: 'full',
      implementation: 'Path-specific instruction files with glob patterns',
      location: '.github/instructions/*.instructions.md',
    },
    claude: {
      level: 'full',
      implementation: 'Nested memory files in subdirectories',
      location: '{directory}/CLAUDE.md',
    },
  },
  {
    primitiveId: 'prompt-templates',
    primitiveName: 'Prompt Templates',
    copilot: {
      level: 'full',
      implementation: 'Prompt files invoked via / commands',
      location: '.github/prompts/*.prompt.md',
    },
    claude: {
      level: 'full',
      implementation: 'Slash commands with full frontmatter support',
      location: '.claude/commands/*.md',
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
      implementation: 'Custom subagents with roles and tool permissions',
      location: '.claude/agents/*.md',
    },
  },
  {
    primitiveId: 'guardrails',
    primitiveName: 'Guardrails',
    copilot: {
      level: 'full',
      implementation: 'Org policies and tool permissions',
      location: 'VS Code settings + org policies',
    },
    claude: {
      level: 'full',
      implementation: 'Permission system with allow/deny lists and sandbox',
      location: '.claude/settings.json',
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
      implementation: 'Run tests/lint via Bash tool',
      location: 'Bash tool in Claude Code',
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
