export type Provider = 'copilot' | 'claude' | 'cursor' | 'codex'
export type SupportLevel = 'full' | 'partial' | 'diy'
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
  support: SupportLevel
  /** Primary provider documentation */
  sourceUrl?: string
  /** Documented configuration scopes when the primitive supports them */
  scopes?: ProviderScope[]
}

export interface ProviderScope {
  scope: string
  location: string
  visibility: string
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
        location: 'agent mode in your IDE',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent',
      },
      {
        provider: 'claude',
        implementation: 'Agentic workflows in Claude Code',
        location: 'Claude Code',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/sub-agents',
      },
      {
        provider: 'cursor',
        implementation: 'Cursor Agent mode for multi-step execution',
        location: 'Agent (Chat) and Cloud Agents',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/agent/hooks',
      },
      {
        provider: 'codex',
        implementation: 'Agentic coding with multi-step execution',
        location: 'Codex CLI',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/cli',
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
        location: '.github/skills/<name>/SKILL.md (also .claude/skills, .agents/skills; personal: ~/.copilot/skills, ~/.agents/skills)',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/concepts/agents/about-agent-skills',
      },
      {
        provider: 'claude',
        implementation: 'Skill modules in .claude directory',
        location: '.claude/skills/<name>/SKILL.md (also ~/.claude/skills/<name>/SKILL.md for personal skills)',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/skills',
      },
      {
        provider: 'cursor',
        implementation: 'Skill modules as portable, reusable packages',
        location: '.cursor/skills/<name>/SKILL.md (also discovers .agents/skills, .claude/skills, .codex/skills, and their ~/ personal equivalents)',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/skills',
      },
      {
        provider: 'codex',
        implementation: 'Skill modules following agentskills.io specification',
        location: '.agents/skills/<name>/SKILL.md (repo scope, up to repo root); personal: ~/.agents/skills; admin: /etc/codex/skills',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/build-skills',
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
        location: '.vscode/mcp.json, VS Code settings.json (also Visual Studio, JetBrains IDEs, Xcode, Eclipse)',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp',
        scopes: [
          { scope: 'Workspace', location: '.vscode/mcp.json', visibility: 'Team (shared)' },
          { scope: 'User Profile', location: 'VS Code profile settings', visibility: 'You only (profile)' },
          { scope: 'Dev Container', location: 'devcontainer.json customizations.vscode', visibility: 'Container (shared)' },
        ],
      },
      {
        provider: 'claude',
        implementation: 'MCP servers and tool calling',
        location: '.mcp.json or ~/.claude.json',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/mcp',
        scopes: [
          { scope: 'Local (default)', location: '~/.claude.json (per-project path)', visibility: 'You only (1 project)' },
          { scope: 'Project', location: '.mcp.json (project root)', visibility: 'Team (shared)' },
          { scope: 'User', location: '~/.claude.json (global section)', visibility: 'You only (all projects)' },
        ],
      },
      {
        provider: 'cursor',
        implementation: 'MCP servers with stdio, SSE, and Streamable HTTP transports',
        location: '.cursor/mcp.json, ~/.cursor/mcp.json',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/context/mcp',
        scopes: [
          { scope: 'Project', location: '.cursor/mcp.json', visibility: 'Team (shared)' },
          { scope: 'User', location: '~/.cursor/mcp.json', visibility: 'You only (all projects)' },
        ],
      },
      {
        provider: 'codex',
        implementation: 'MCP servers with stdio and Streamable HTTP transports',
        location: '~/.codex/config.toml, .codex/config.toml',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/extend/mcp',
        scopes: [
          { scope: 'Project', location: '.codex/config.toml', visibility: 'Team (shared)' },
          { scope: 'User', location: '~/.codex/config.toml', visibility: 'You only (all projects)' },
        ],
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
        location: './CLAUDE.md, ./.claude/CLAUDE.md',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/memory',
      },
      {
        provider: 'cursor',
        implementation: 'Project instructions file',
        location: 'AGENTS.md',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/context/rules',
      },
      {
        provider: 'codex',
        implementation: 'Project AGENTS.md file with hierarchical loading',
        location: 'AGENTS.md, AGENTS.override.md',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/agent-configuration/agents-md',
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
        implementation: 'User-level Copilot CLI instruction files',
        location: '$HOME/.copilot/copilot-instructions.md, $HOME/.copilot/instructions/**/*.instructions.md',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions',
      },
      {
        provider: 'claude',
        implementation: 'User-level memory and config',
        location: '~/.claude/CLAUDE.md',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/memory',
      },
      {
        provider: 'cursor',
        implementation: 'User-level settings and preferences',
        location: 'User Rules (global to your Cursor environment; not stored on the file system)',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/skills',
      },
      {
        provider: 'codex',
        implementation: 'User-level AGENTS.md with override precedence',
        location: '~/.codex/AGENTS.md, ~/.codex/AGENTS.override.md',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/agent-configuration/agents-md',
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
        location: 'subdir/AGENTS.md, .github/instructions/**/*.instructions.md',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
      },
      {
        provider: 'claude',
        implementation: 'Rule files with globs frontmatter',
        location: '.claude/rules/*.md',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/memory',
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
        location: 'subdir/AGENTS.md, subdir/AGENTS.override.md',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/agent-configuration/agents-md',
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
        location: 'Codex CLI /permissions command',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/cli',
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
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-custom-agents-in-your-ide',
      },
      {
        provider: 'claude',
        implementation: 'Custom subagents with roles and tool permissions',
        location: '.claude/agents/*.md, ~/.claude/agents/*.md',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/sub-agents',
      },
      {
        provider: 'cursor',
        implementation: 'Subagents with model selection and context isolation',
        location: '.cursor/agents/*.md',
        support: 'full',
      },
      {
        provider: 'codex',
        implementation: 'Subagent definitions with model selection and delegation',
        location: '.codex/agents/*.toml, ~/.codex/agents/*.toml',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/agent-configuration/subagents',
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
        location: 'Organization or repository Settings > Copilot > Internet access',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall',
      },
      {
        provider: 'claude',
        implementation: 'Allow/deny lists with pattern matching and sandbox',
        location: '.claude/settings.json, .claude/settings.local.json, ~/.claude/settings.json',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/settings',
      },
      {
        provider: 'cursor',
        implementation: 'Approvals, .cursorignore, LLM safety controls, and security hooks',
        location: 'Settings > Agents > Approvals & Execution, .cursorignore, permissions.json, sandbox.json',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/agent/security/run-modes',
      },
      {
        provider: 'codex',
        implementation: 'Sandbox modes, approval policies, and admin-enforced requirements',
        location: '~/.codex/config.toml, .codex/config.toml, requirements.toml',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/config-file/config-reference',
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
        location: '.github/hooks/*.json, ~/.copilot/hooks/*.json',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/reference/hooks-reference',
      },
      {
        provider: 'claude',
        implementation: 'Lifecycle hooks configured in shared project settings',
        location: '.claude/settings.json, ~/.claude/settings.json, .claude/settings.local.json',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/hooks',
      },
      {
        provider: 'cursor',
        implementation: 'Session, execution, and file operation hooks',
        location: '.cursor/hooks.json',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/agent/hooks',
      },
      {
        provider: 'codex',
        implementation: 'Lifecycle hooks (session, subagent, prompt, tool, compaction events) via hooks.json or config.toml',
        location: '~/.codex/hooks.json, .codex/hooks.json, ~/.codex/config.toml, .codex/config.toml',
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
        location: 'Organization or repository Settings > Copilot > Internet access',
        support: 'partial',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall',
      },
      {
        provider: 'claude',
        implementation: 'Sandboxing and command allow/deny controls',
        location: '.claude/settings.json, .claude/settings.local.json, ~/.claude/settings.json',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/settings',
      },
      {
        provider: 'cursor',
        implementation: 'Run modes with sandboxing, plus allow/deny permissions',
        location: 'Settings > Agents > Approvals & Execution, permissions.json, sandbox.json',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/agent/security/run-modes',
      },
      {
        provider: 'codex',
        implementation: 'Sandbox modes plus approval policies',
        location: '~/.codex/config.toml, .codex/config.toml, requirements.toml',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/config-file/config-reference',
      },
    ],
    category: 'control-approval',
  },
  {
    id: 'distribution',
    name: 'Configuration Distribution',
    description: 'How shared agent configuration is packaged, installed, and governed.',
    whatItIs: 'The packaging and dependency lifecycle around agent configuration: discovery, installation, versioning, provenance, policy, updates, audit, removal, and rollback. Portable standards define components and packages; provider marketplaces and package managers place them into the runtime-specific locations each agent understands.',
    useWhen: [
      'A skill and its MCP tools should travel as one reviewed package',
      'A team needs reproducible agent setup across repositories or harnesses',
      'You need version pins, policy, audit, updates, or safe removal',
    ],
    prevents: 'Configuration drift and unreviewed supply-chain changes caused by copying or installing agent assets ad hoc',
    combineWith: ['Skills / Workflows', 'Tool Integrations (MCP)', 'Lifecycle Hooks', 'Verification / Evals'],
    implementations: [
      {
        provider: 'copilot',
        implementation: 'Plugins and marketplaces with Agent Plugins support',
        location: 'copilot plugin ..., /plugin',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing',
      },
      {
        provider: 'claude',
        implementation: 'Plugins and marketplaces with user, project, and local installation scopes',
        location: '/plugin, enabledPlugins in Claude settings',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/discover-plugins',
      },
      {
        provider: 'cursor',
        implementation: 'Agent Plugins and Cursor Plugins installed from marketplaces',
        location: 'Customize -> Plugins',
        support: 'full',
        sourceUrl: 'https://cursor.com/docs/plugins',
      },
      {
        provider: 'codex',
        implementation: 'Plugins and repo or personal marketplace sources shared with ChatGPT',
        location: 'codex plugin marketplace ..., .agents/plugins/marketplace.json',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/plugins/build/plugins',
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
        location: 'Copilot cloud agent Bash tool',
        support: 'full',
        sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall',
      },
      {
        provider: 'claude',
        implementation: 'Run tests/lint via Bash tool with hooks',
        location: 'Bash tool + hooks',
        support: 'full',
        sourceUrl: 'https://code.claude.com/docs/en/hooks',
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
        location: 'Codex CLI',
        support: 'full',
        sourceUrl: 'https://developers.openai.com/codex/cli',
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
  tier: 'defaults' | 'project' | 'runtime'
  audience: string
  example: string
  location?: string
}

export const scopeModel: ScopeModelEntry[] = [
  { id: 'managed', name: 'Managed / organization', tier: 'defaults', audience: 'Everyone in an organization', example: 'Set centrally governed policy and shared defaults.', location: 'Organization policy or managed CLAUDE.md' },
  { id: 'user', name: 'User', tier: 'defaults', audience: 'You, across projects', example: 'Keep personal preferences out of shared repositories.', location: '~/.claude/CLAUDE.md' },
  { id: 'repository', name: 'Repository', tier: 'project', audience: 'Everyone in one repository', example: 'Share build commands, conventions, and safety boundaries.', location: 'AGENTS.md' },
  { id: 'local-repository', name: 'Local repository', tier: 'project', audience: 'You, in one checkout', example: 'Add workstation-specific settings without committing them.', location: 'CLAUDE.local.md' },
  { id: 'directory', name: 'Directory / path', tier: 'project', audience: 'Work under one path', example: 'Narrow instructions where languages, owners, or risks differ.', location: '.claude/rules/*.md' },
  { id: 'agent', name: 'Agent', tier: 'project', audience: 'One specialized agent', example: 'Give a delegated role its own tools and operating rules.', location: '.github/agents/*.agent.md' },
  { id: 'session', name: 'Session', tier: 'runtime', audience: 'One conversation', example: 'Choose a temporary mode or preserve live context.' },
  { id: 'turn', name: 'Turn', tier: 'runtime', audience: 'One request', example: 'State a constraint that only applies to the current prompt.' },
  { id: 'tool-invocation', name: 'Tool invocation', tier: 'runtime', audience: 'One action', example: 'Apply a hook check or approval gate immediately before execution.' },
]
