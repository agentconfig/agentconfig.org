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
      level: 'partial',
      implementation: 'Slash commands or manual prompts',
      location: 'Built-in slash commands',
    },
  },
  {
    primitiveId: 'structured-output',
    primitiveName: 'Structured Output',
    copilot: {
      level: 'full',
      implementation: 'Format rules in prompts and instructions',
      location: 'Prompt files + instructions',
    },
    claude: {
      level: 'full',
      implementation: 'Format rules in prompts and memory',
      location: 'CLAUDE.md + prompts',
    },
  },
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
    primitiveId: 'custom-agents',
    primitiveName: 'Custom Agents',
    copilot: {
      level: 'full',
      implementation: 'Agent definition files with roles and tool permissions',
      location: '.github/agents/*.agent.md',
    },
    claude: {
      level: 'partial',
      implementation: 'Use skills to achieve similar behavior',
      location: '.claude/skills/',
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
  {
    primitiveId: 'memory',
    primitiveName: 'Memory',
    copilot: {
      level: 'full',
      implementation: 'Repo instructions and AGENTS.md files',
      location: 'AGENTS.md + instructions',
    },
    claude: {
      level: 'full',
      implementation: 'CLAUDE.md memory files at any level',
      location: 'CLAUDE.md files',
    },
  },
  {
    primitiveId: 'retrieval',
    primitiveName: 'Retrieval (RAG)',
    copilot: {
      level: 'full',
      implementation: 'Via MCP tools and workspace search',
      location: 'MCP server tools',
    },
    claude: {
      level: 'full',
      implementation: 'Via MCP tools and file search',
      location: 'MCP server tools',
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
      level: 'partial',
      implementation: 'Tool permissions in settings',
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
