export type Provider = 'copilot' | 'claude'

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
  category: 'instructions' | 'execution' | 'tools' | 'safety'
}

export const primitives: Primitive[] = [
  {
    id: 'persistent-instructions',
    name: 'Persistent Instructions',
    description: 'A durable set of norms that define "good" for your project.',
    whatItIs: 'A durable set of norms: tone, coding standards, constraints, safety rules, and "definition of done." These form the behavioral contract that governs all AI interactions.',
    useWhen: [
      'You want consistent behavior across many tasks',
      'You want the AI to honor repo conventions without re-learning',
      'You need a "definition of done" for your project',
    ],
    prevents: 'Stylistic drift and rework from inconsistent outputs',
    combineWith: ['Prompt Templates', 'Agent Skills'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Repository-level instructions file',
        location: '.github/copilot-instructions.md',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Project memory file',
        location: 'CLAUDE.md',
        support: 'full',
      },
    ],
    category: 'instructions',
  },
  {
    id: 'scope-specific-instructions',
    name: 'Scope-Specific Instructions',
    description: 'Instructions that apply only within a specific boundary.',
    whatItIs: 'Instructions that apply only within a scope boundary (repo, directory, workspace, project). Enables "policy close to the code" where different parts of a system can have different conventions.',
    useWhen: [
      'Different parts of a system have different conventions',
      'Frontend and backend need different rules',
      'You want policy close to the code it governs',
    ],
    prevents: 'Accidental cross-domain assumptions (backend rules applied to frontend)',
    combineWith: ['Tools', 'Persistent Instructions'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Path-specific instruction files with glob patterns',
        location: '.github/instructions/*.instructions.md',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Nested memory files in subdirectories',
        location: '{directory}/CLAUDE.md',
        support: 'full',
      },
    ],
    category: 'instructions',
  },
  {
    id: 'prompt-templates',
    name: 'Prompt Templates',
    description: 'Repeatable prompts for recurring tasks.',
    whatItIs: 'Reusable prompts for recurring tasks like "write tests", "summarize this ADR", or "generate migration plan". Saves time and ensures consistent inputs/outputs.',
    useWhen: [
      'You notice yourself rewriting the same prompt',
      'A team wants consistent inputs/outputs',
      'You have a repeatable task pattern',
    ],
    prevents: 'Prompt drift and inconsistent outputs across team members',
    combineWith: ['Persistent Instructions', 'Structured Output'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Prompt files invoked via / commands',
        location: '.github/prompts/*.prompt.md',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Slash commands or manual prompts',
        location: 'Slash commands in chat',
        support: 'partial',
      },
    ],
    category: 'instructions',
  },
  {
    id: 'structured-output',
    name: 'Structured Output',
    description: 'Required output shapes like schemas, checklists, or formats.',
    whatItIs: 'A required output shape (table, JSON schema, checklist, ADR format, test plan format). Ensures the AI "shows its work" in a verifiable, actionable way.',
    useWhen: [
      'Downstream automation depends on predictable formatting',
      'You want the AI to show its work in a verifiable way',
      'You need citations, tests, or acceptance criteria',
    ],
    prevents: 'Vague answers that cannot be executed or verified',
    combineWith: ['Tools', 'Verification'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Format rules in prompts and instructions',
        location: 'Prompt files + instructions',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Format rules in prompts and memory',
        location: 'CLAUDE.md + prompts',
        support: 'full',
      },
    ],
    category: 'instructions',
  },
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
    ],
    category: 'execution',
  },
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
        implementation: 'Use skills to achieve similar behavior',
        location: '.claude/skills/',
        support: 'partial',
      },
    ],
    category: 'execution',
  },
  {
    id: 'tool-integrations',
    name: 'Tool Integrations',
    description: 'External tools for retrieving facts and taking actions.',
    whatItIs: 'The AI calling tools to retrieve facts or perform actions (search, DB query, GitHub, CI, observability). Grounds the AI in reality.',
    useWhen: [
      '"Correct" depends on reality outside the model\'s weights',
      'You need actions: create PRs, comment on issues, run tests',
      'You want to query current state (logs, incidents)',
    ],
    prevents: 'Hallucinated facts and stale guidance',
    combineWith: ['Structured Output', 'Guardrails'],
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
    ],
    category: 'tools',
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Persistent facts the AI should always know.',
    whatItIs: 'Store stable facts/preferences (architecture overview, team conventions). The AI "remembers" these without you repeating yourself.',
    useWhen: [
      'You want to stop repeating yourself',
      'You have stable project facts that rarely change',
      'You want consistent understanding across sessions',
    ],
    prevents: 'Forgetting basics and requiring constant re-explanation',
    combineWith: ['Retrieval', 'Persistent Instructions'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Repo instructions and AGENTS.md files',
        location: 'AGENTS.md + .github/copilot-instructions.md',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'CLAUDE.md memory files',
        location: 'CLAUDE.md files',
        support: 'full',
      },
    ],
    category: 'tools',
  },
  {
    id: 'retrieval',
    name: 'Retrieval (RAG)',
    description: 'Just-in-time context fetching for current information.',
    whatItIs: 'Fetch volatile/large info when needed (recent logs, current incident state, latest docs). Keeps context lean and information current.',
    useWhen: [
      'Information changes frequently',
      'Context would be too large to include always',
      'You need current state (logs, incidents, docs)',
    ],
    prevents: 'Context overload and stale information',
    combineWith: ['Tools', 'Skills'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Via MCP tools and search',
        location: 'MCP server tools',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Via MCP tools and search',
        location: 'MCP server tools',
        support: 'full',
      },
    ],
    category: 'tools',
  },
  {
    id: 'guardrails',
    name: 'Guardrails',
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
        implementation: 'Policies and tool permissions',
        location: '.claude/settings.json',
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
    combineWith: ['Tools', 'Structured Output'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Run tests/lint via tools',
        location: 'Terminal tools in agent mode',
        support: 'full',
      },
      {
        provider: 'claude',
        implementation: 'Run tests/lint via tools',
        location: 'Bash tool in Claude Code',
        support: 'full',
      },
    ],
    category: 'safety',
  },
]

export const categories = [
  { id: 'all', name: 'All Primitives' },
  { id: 'instructions', name: 'Instructions' },
  { id: 'execution', name: 'Execution' },
  { id: 'tools', name: 'Tools & Data' },
  { id: 'safety', name: 'Safety' },
] as const

export type CategoryId = (typeof categories)[number]['id']
