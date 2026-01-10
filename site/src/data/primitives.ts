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
    ],
    category: 'execution',
  },
  // === CUSTOMIZATION: Here's how to shape it ===
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
    combineWith: ['Prompt Templates', 'Scope-Specific Instructions'],
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
    combineWith: ['Persistent Instructions', 'Custom Agents'],
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
        implementation: 'Slash commands or manual prompts',
        location: 'Slash commands in chat',
        support: 'partial',
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
        implementation: 'Use skills to achieve similar behavior',
        location: '.claude/skills/',
        support: 'partial',
      },
    ],
    category: 'safety',
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
    combineWith: ['Agent Mode', 'Tool Integrations'],
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
  { id: 'execution', name: 'Capability' },
  { id: 'instructions', name: 'Customization' },
  { id: 'safety', name: 'Control' },
] as const

export type CategoryId = (typeof categories)[number]['id']
