export type Provider = 'copilot' | 'claude' | 'cursor' | 'codex'
export type LayerId =
  | 'instructions'
  | 'procedures'
  | 'tools-context'
  | 'delegation'
  | 'control-approval'
  | 'memory-state'
  | 'distribution'
  | 'verification-observability'

export interface ProviderImplementation {
  /** Provider name */
  provider: Provider
  /** How this primitive is implemented */
  implementation: string
  /** File location or feature name */
  location: string
  /** Support level */
  support: 'full' | 'partial' | 'diy'
  /** Primary provider documentation */
  sourceUrl?: string
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
  /** Layer for filtering */
  category: LayerId
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
    category: 'delegation',
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
    category: 'procedures',
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
        location: '.mcp.json or ~/.claude.json',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/mcp',
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
    category: 'tools-context',
  },
  // === CUSTOMIZATION: Here's how to shape it ===
  {
    id: 'persistent-instructions',
    name: 'Persistent Instructions',
    description: 'A durable set of norms that define "good" for your project.',
    whatItIs: 'A durable set of norms: tone, coding standards, constraints, safety rules, and "definition of done." These form the behavioral contract that governs all AI interactions. A common usage pattern is a root AGENTS.md plus nested AGENTS.md files where local constraints differ.',
    useWhen: [
      'You want consistent behavior across many tasks',
      'You want the AI to honor repo conventions without re-learning',
      'You need a "definition of done" for your project',
    ],
    prevents: 'Stylistic drift and rework from inconsistent outputs',
    combineWith: ['Prompt Templates', 'Scope-Specific Instructions'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'AGENTS.md or repository instructions file',
        location: 'AGENTS.md or .github/copilot-instructions.md',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
      },
      {
        provider: 'claude',
        implementation: 'Project memory file with @imports',
        location: 'CLAUDE.md',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'Project instructions file',
        location: '.cursor/instructions.md',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Project AGENTS.md file with hierarchical loading',
        location: 'AGENTS.md',
        support: 'full',
      },
    ],
    category: 'instructions',
  },
  {
    id: 'global-instructions',
    name: 'User Scope Instructions',
    description: 'User-level preferences that apply across all projects.',
    whatItIs: 'Personal preferences and standards that follow you across all projects. Defines your individual coding style, preferred patterns, and global behaviors.',
    useWhen: [
      'You want consistent personal preferences across projects',
      'You have coding standards you always follow',
      'You want global slash commands or agents available everywhere',
    ],
    prevents: 'Repeating the same preferences in every project',
    combineWith: ['Persistent Instructions', 'Custom Agents'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'User-level settings in VS Code',
        location: 'VS Code settings.json',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'User-level memory and config',
        location: '~/.claude/CLAUDE.md',
        support: 'full',
      },
      {
        provider: 'cursor',
        implementation: 'User-level settings and preferences',
        location: '~/.cursor/settings.json',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'User-level AGENTS.md and config.toml',
        location: '~/.codex/AGENTS.md',
        support: 'full',
      },
    ],
    category: 'instructions',
  },
  {
    id: 'scope-specific-instructions',
    name: 'Directory / Path Scope Instructions',
    description: 'Instructions that apply only to specific file paths.',
    whatItIs: 'Instructions that apply only within a scope boundary defined by glob patterns. Enables "policy close to the code" where different parts of a system can have different conventions.',
    useWhen: [
      'Different parts of a system have different conventions',
      'Frontend and backend need different rules',
      'You want policy close to the code it governs',
    ],
    prevents: 'Accidental cross-domain assumptions (backend rules applied to frontend)',
    combineWith: ['Persistent Instructions', 'Custom Agents'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Nested AGENTS.md or applyTo instruction files',
        location: 'subdir/AGENTS.md or .github/instructions/*.instructions.md',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
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
        location: '.cursor/rules/*.mdc',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/context/rules',
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
    combineWith: ['Persistent Instructions', 'Skills'],
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
    category: 'procedures',
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
    category: 'delegation',
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
    category: 'control-approval',
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
        implementation: 'Lifecycle hooks for Copilot CLI and cloud agent',
        location: '.github/hooks/*.json',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/reference/hooks-reference',
      },
      {
        provider: 'claude',
        implementation: 'Lifecycle hooks configured in shared project settings',
        location: '.claude/settings.json',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/hooks',
      },
      {
        provider: 'cursor',
        implementation: 'Session, execution, and file operation hooks',
        location: '.cursor/hooks.json',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Lifecycle hooks (session, subagent, prompt, tool, compaction events) via hooks.json or config.toml',
        location: '~/.codex/hooks.json, <repo>/.codex/hooks.json, ~/.codex/config.toml, <repo>/.codex/config.toml',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/hooks',
      },
    ],
    category: 'control-approval',
  },
  {
    id: 'runtime-sandbox',
    name: 'Runtime Sandbox',
    description: 'Execution boundaries that constrain what agent actions can do.',
    whatItIs: 'Sandbox and approval policies that restrict filesystem, network, and command capabilities at runtime. This is execution environment context, not just prompt wording.',
    useWhen: [
      'Agent runs can touch sensitive code or systems',
      'You need explicit constraints on network, shell, or write access',
      'You want deterministic approval boundaries before side effects',
    ],
    prevents: 'Accidental high-blast-radius execution',
    combineWith: ['Permissions & Guardrails', 'Lifecycle Hooks'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Policy and execution constraints in agent runtime and org settings',
        location: 'Copilot policy/settings surfaces',
        support: 'partial',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall',
      },
      {
        provider: 'claude',
        implementation: 'Sandboxing and command allow/deny controls',
        location: '.claude/settings.json',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/settings',
      },
      {
        provider: 'cursor',
        implementation: 'Run modes with sandboxing, plus allow/deny permissions',
        location: 'Settings > Agents > Approvals & Execution + .cursor/cli-config.json',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/agent/security/run-modes',
      },
      {
        provider: 'codex',
        implementation: 'Sandbox modes plus approval policies',
        location: '~/.codex/config.toml',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/config-file/config-reference',
      },
    ],
    category: 'control-approval',
  },
  {
    id: 'distribution',
    name: 'Configuration Distribution',
    description: 'How shared agent configuration is packaged and discovered.',
    whatItIs: 'The way instructions, skills, and agent definitions are distributed across repositories, directories, and personal environments so teams can share one source and localize where needed.',
    useWhen: [
      'You want one canonical instruction source with minimal duplication',
      'You need shared defaults plus local overrides by path',
      'You are rolling standards across many repositories',
    ],
    prevents: 'Drift caused by copying the same guidance into many files',
    combineWith: ['Persistent Instructions', 'Directory / Path Scope Instructions', 'Skills / Workflows'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Repository plus nested AGENTS.md with optional .instructions.md files',
        location: 'AGENTS.md and .github/instructions/*.instructions.md',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
      },
      {
        provider: 'claude',
        implementation: 'Shared AGENTS.md imported into CLAUDE.md plus scoped rules files',
        location: 'AGENTS.md, CLAUDE.md, .claude/rules/*.md',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/memory',
      },
      {
        provider: 'cursor',
        implementation: 'Project instructions, rules, and reusable skills packages',
        location: '.cursor/instructions.md, .cursor/rules/*.mdc, .cursor/skills/*/SKILL.md',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/skills',
      },
      {
        provider: 'codex',
        implementation: 'Hierarchical AGENTS.md with user+repo layering',
        location: 'AGENTS.md, subdir/AGENTS.md, ~/.codex/AGENTS.md',
        support: 'full',
      },
    ],
    category: 'distribution',
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
    category: 'verification-observability',
  },
]

export const categories = [
  { id: 'all', name: 'All Primitives' },
  { id: 'instructions', name: 'Instructions' },
  { id: 'procedures', name: 'Procedures' },
  { id: 'tools-context', name: 'Tools & Context' },
  { id: 'delegation', name: 'Delegation' },
  { id: 'control-approval', name: 'Control & Approval' },
  { id: 'memory-state', name: 'Memory & State' },
  { id: 'distribution', name: 'Distribution' },
  { id: 'verification-observability', name: 'Verification & Observability' },
] as const

export type CategoryId = (typeof categories)[number]['id']

export interface ScopeModelEntry {
  id: string
  name: string
  example: string
}

export const scopeModel: ScopeModelEntry[] = [
  { id: 'managed', name: 'Managed / organization', example: 'Org-level Copilot policies or centrally managed CLAUDE.md' },
  { id: 'user', name: 'User', example: '~/.codex/AGENTS.md, ~/.claude/CLAUDE.md, personal Copilot settings' },
  { id: 'repository', name: 'Repository', example: 'AGENTS.md, CLAUDE.md, .github/copilot-instructions.md' },
  { id: 'local-repository', name: 'Local repository', example: 'CLAUDE.local.md or workstation-only repo settings' },
  { id: 'directory', name: 'Directory / path', example: 'Nested AGENTS.md, .claude/rules/*.md, .instructions.md with applyTo' },
  { id: 'agent', name: 'Agent', example: '.github/agents/*.agent.md or .claude/agents/*.md' },
  { id: 'session', name: 'Session', example: 'Temporary mode selections and live conversation context' },
  { id: 'turn', name: 'Turn', example: 'One-off user prompt constraints for the current request' },
  { id: 'tool-invocation', name: 'Tool invocation', example: 'Per-hook/per-tool policy checks and approval gates' },
]
