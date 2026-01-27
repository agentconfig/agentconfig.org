export type Provider = 'copilot' | 'claude' | 'cursor' | 'codex'

export interface ProviderImplementation {
  /** Provider name */
  provider: Provider
  /** How this primitive is implemented */
  implementation: string
  /** File location or feature name */
  location: string
  /** Support level */
  support: 'full' | 'partial' | 'diy'
}

export interface Primitive {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Detailed explanation */
  whatItIs: string
  /** When to use this primitive */
  useWhen: string[]
  /** What failure mode it prevents */
  prevents: string
  /** What to combine it with */
  combineWith: string[]
  /** Provider-specific implementations */
  implementations: ProviderImplementation[]
  /** Category for filtering */
  category: 'instructions' | 'execution' | 'safety'
}

export const primitives: Primitive[] = [
  // === CAPABILITY: Here's what it can do ===
  {
    id: 'agent-mode',
    name: 'Agent Mode',
    description: 'Multi-step execution with planning and tool use.',
    whatItIs: 'A mode where the AI can plan and execute over multiple steps, often with tools (file edits, searches, running tests). Works until done, not just answers.',
    useWhen: [
      'The task spans multiple files',
      'You need iterative debugging',
      'You want the system to keep working until done',
    ],
    prevents: '"One-shot" incomplete solutions that require manual follow-up',
    combineWith: ['Skills', 'Tools', 'Verification'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Agent mode in Copilot Chat',
        location: 'VS Code Copilot Chat',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Agentic workflows in Claude Code',
        location: 'Claude Code CLI',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Cursor Agent mode for multi-step execution',
        location: 'Cursor Editor with Agent capabilities',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Agentic coding with multi-step execution',
        location: 'Codex CLI',
        support: 'full',
      },
    ],
    category: 'execution',
  },
  {
    id: 'skills',
    name: 'Skills / Workflows',
    description: 'Reusable multi-step procedures for common tasks.',
    whatItIs: 'A packaged procedure the agent can follow ("triage incident", "fix failing CI", "refactor module safely"). Encodes best practices into repeatable workflows.',
    useWhen: [
      'You want reliability and repeatability across runs',
      'The work has a known process with good best practices',
      'You want to encode expert knowledge',
    ],
    prevents: 'Ad-hoc flailing and missed steps in complex tasks',
    combineWith: ['Agent Mode', 'Tools'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Skill modules in skills directory',
        location: '.github/skills/*/SKILL.md',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Skill modules in .claude directory',
        location: '.claude/skills/*/SKILL.md',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Skill modules as portable, reusable packages',
        location: '.cursor/skills/*/SKILL.md',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Skill modules following agentskills.io specification',
        location: '.codex/skills/*/SKILL.md',
        support: 'full',
      },
    ],
    category: 'execution',
  },
  {
    id: 'tool-integrations',
    name: 'Tool Integrations (MCP)',
    description: 'External tools for retrieving facts and taking actions.',
    whatItIs: 'The AI calling tools to retrieve facts or perform actions (search, DB query, GitHub, CI, observability). Grounds the AI in reality.',
    useWhen: [
      '"Correct" depends on reality outside the model\'s weights',
      'You need actions: create PRs, comment on issues, run tests',
      'You want to query current state (logs, incidents)',
    ],
    prevents: 'Hallucinated facts and stale guidance',
    combineWith: ['Guardrails', 'Verification'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'MCP servers and tool calling',
        location: 'VS Code MCP settings',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'MCP servers and tool calling',
        location: '.claude/settings.json',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'MCP servers with stdio, SSE, and HTTP transports',
        location: '.cursor/mcp.json',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'MCP servers with stdio and HTTP transports',
        location: '~/.codex/config.toml',
        support: 'full',
      },
    ],
    category: 'execution',
  },
  // === CUSTOMIZATION: Here's how to shape it ===
  {
    id: 'instructions',
    name: 'Instructions',
    description: 'Persistent rules and preferences at project or user level.',
    whatItIs: 'Durable norms that define "good" for your work: coding standards, tone, constraints, safety rules, and definition of done. Can be project-scoped (repository-wide) or user-scoped (personal preferences across all projects).',
    useWhen: [
      'You want consistent behavior across many tasks',
      'You want the AI to honor conventions without re-learning',
      'You need a "definition of done" for your project',
      'You have personal coding standards you always follow',
    ],
    prevents: 'Stylistic drift, rework from inconsistent outputs, and repeating preferences in every project',
    combineWith: ['Path-Scoped Rules', 'Slash Commands', 'Custom Agents'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Repository-level and user-level instructions',
        location: '.github/copilot-instructions.md, VS Code settings.json',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Project and user-level memory files',
        location: 'CLAUDE.md, ~/.claude/CLAUDE.md',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Project and user-level settings',
        location: '.cursor/instructions.md, ~/.cursor/settings.json',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Project and user-level AGENTS.md files',
        location: 'AGENTS.md, ~/.codex/AGENTS.md',
        support: 'full',
      },
    ],
    category: 'instructions',
  },
  {
    id: 'scope-specific-instructions',
    name: 'Path-Scoped Rules',
    description: 'Instructions that apply only to specific file paths.',
    whatItIs: 'Instructions that apply only within a scope boundary defined by glob patterns. Enables "policy close to the code" where different parts of a system can have different conventions.',
    useWhen: [
      'Different parts of a system have different conventions',
      'Frontend and backend need different rules',
      'You want policy close to the code it governs',
    ],
    prevents: 'Accidental cross-domain assumptions (backend rules applied to frontend)',
    combineWith: ['Instructions', 'Custom Agents'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Instruction files with applyTo glob patterns',
        location: '.github/instructions/*.instructions.md',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Rule files with globs frontmatter',
        location: '.claude/rules/*.md',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Rules with path patterns',
        location: '.cursor/rules/*.md',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Nested AGENTS.md files with hierarchical merge',
        location: 'subdir/AGENTS.md',
        support: 'full',
      },
    ],
    category: 'instructions',
  },
  {
    id: 'prompt-templates',
    name: 'Slash Commands',
    description: 'Repeatable prompts invoked via / commands.',
    whatItIs: 'Reusable prompts for recurring tasks like "write tests", "summarize this ADR", or "generate migration plan". Invoked via slash commands for quick access.',
    useWhen: [
      'You notice yourself rewriting the same prompt',
      'A team wants consistent inputs/outputs',
      'You have a repeatable task pattern',
    ],
    prevents: 'Prompt drift and inconsistent outputs across team members',
    combineWith: ['Instructions', 'Skills'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Prompt files invoked via / commands',
        location: '.github/prompts/*.prompt.md',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Command files with frontmatter and $ARGUMENTS',
        location: '.claude/commands/*.md',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Custom commands with parameters and reusable workflows',
        location: '.cursor/commands/*.md',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Built-in / commands for session control',
        location: 'Codex CLI / commands',
        support: 'full',
      },
    ],
    category: 'instructions',
  },
  // === CONTROL: Here's how to control it ===
  {
    id: 'custom-agents',
    name: 'Custom Agents',
    description: 'Specialized agent personas with specific roles and permissions.',
    whatItIs: 'Defines specialized agent personas with specific roles, behaviors, and tool permissions. Allows switching between different "modes" of AI assistance.',
    useWhen: [
      'You need different AI behaviors for different tasks',
      'You want to restrict tools for certain workflows',
      'You want role-specific expertise (reviewer, planner, etc.)',
    ],
    prevents: 'One-size-fits-all behavior that misses context',
    combineWith: ['Skills', 'Guardrails'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Agent definition files',
        location: '.github/agents/*.agent.md',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Custom subagents with roles and tool permissions',
        location: '.claude/agents/*.md',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Subagents with model selection and context isolation',
        location: '.cursor/agents/*.md',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Multi-agent via Agents SDK (not built-in)',
        location: 'External Agents SDK',
        support: 'diy',
      },
    ],
    category: 'safety',
  },
  {
    id: 'guardrails',
    name: 'Permissions & Guardrails',
    description: 'Explicit constraints on what the AI can do.',
    whatItIs: 'Explicit constraints on what the AI is allowed to do (no prod writes, require approvals, redact secrets). Essential for safe tool use.',
    useWhen: [
      'Tools can make changes or access sensitive systems',
      'You\'re scaling usage to a team',
      'You need audit trails and approvals',
    ],
    prevents: 'Accidental harmful actions and unauthorized access',
    combineWith: ['Agent Mode', 'Tool Integrations'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Org policies and tool permissions',
        location: 'VS Code settings + org policies',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Allow/deny lists with pattern matching and sandbox',
        location: '.claude/settings.json',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Approvals, .cursorignore, LLM safety controls, and security hooks',
        location: '.cursor/settings.json + .cursorignore',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Sandbox modes, approval policies, and .rules files',
        location: '~/.codex/config.toml + ~/.codex/rules/*.rules',
        support: 'full',
      },
    ],
    category: 'safety',
  },
  {
    id: 'hooks',
    name: 'Lifecycle Hooks',
    description: 'Code that runs before/after AI tool execution.',
    whatItIs: 'Custom scripts or commands that run at specific points in the AI workflow: before tool use, after tool use, or when the agent stops. Enables validation, logging, and custom behaviors.',
    useWhen: [
      'You need to validate or transform tool inputs/outputs',
      'You want custom logging or audit trails',
      'You need to enforce policies programmatically',
    ],
    prevents: 'Unvalidated tool execution and missed policy enforcement',
    combineWith: ['Guardrails', 'Verification'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Not available',
        location: 'N/A',
        support: 'diy',
      },
      {
        provider: 'claude',
        implementation: 'PreToolUse, PostToolUse, Stop hooks with matchers',
        location: '.claude/hooks/hooks.json',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Session, execution, and file operation hooks',
        location: '.cursor/hooks.json',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Notify hooks for external program triggers',
        location: '~/.codex/config.toml (notify)',
        support: 'partial',
      },
    ],
    category: 'safety',
  },
  {
    id: 'verification',
    name: 'Verification / Evals',
    description: 'Checks that validate AI outputs before shipping.',
    whatItIs: 'Checks that validate outputs: tests, lint, typecheck, static analysis, golden answers, human review. Reduces "confidence debt."',
    useWhen: [
      'The cost of being wrong is high',
      'You\'re generating code or operational advice',
      'You want to catch errors before they ship',
    ],
    prevents: 'Plausible-but-wrong output shipping to production',
    combineWith: ['Agent Mode', 'Tool Integrations'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Run tests/lint via terminal tools',
        location: 'Terminal tools in agent mode',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Run tests/lint via Bash tool with hooks',
        location: 'Bash tool + hooks',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Integrated terminal for test execution',
        location: 'Cursor Editor integrated terminal',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Shell tool for running tests/lint in agent mode',
        location: 'Codex CLI shell tool',
        support: 'full',
      },
    ],
    category: 'safety',
  },
]

export const categories = [
  { id: 'all', name: 'All Primitives' },
  { id: 'execution', name: 'Capability' },
  { id: 'instructions', name: 'Customization' },
  { id: 'safety', name: 'Control' },
] as const

export type CategoryId = (typeof categories)[number]['id']
