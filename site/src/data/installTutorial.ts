import type { TocItem } from '@/components/TableOfContents'
import type { ProviderTab } from '@/components/ProviderTabs'

export interface InstallLayer {
  readonly name: string
  readonly job: string
  readonly examples: string
}

export interface InstallUnit {
  readonly need: string
  readonly choose: string
  readonly reason: string
}

export interface NativeInstallProfile extends ProviderTab {
  readonly summary: string
  readonly code: string
  readonly language: string
  readonly filename: string
  readonly sourceUrl: string
}

export interface InstallPath {
  readonly path: string
  readonly useWhen: string
  readonly tradeoff: string
}

export interface ReadingLink {
  readonly title: string
  readonly url: string
  readonly source: string
  readonly description: string
}

export const tocItems: readonly TocItem[] = [
  { id: 'first-install', label: '1. Install One Reviewed Package', level: 'beginner' },
  { id: 'layers', label: '2. Understand the Layers', level: 'beginner' },
  { id: 'smallest-unit', label: '3. Choose the Smallest Unit', level: 'beginner' },
  { id: 'portable-package', label: '4. Package Portable Components', level: 'intermediate' },
  { id: 'native-install', label: '5. Use Native Provider Installation', level: 'intermediate' },
  { id: 'apm', label: '6. Make Setup Reproducible with APM', level: 'intermediate' },
  { id: 'scope', label: '7. Choose Installation Scope', level: 'intermediate' },
  { id: 'trust', label: '8. Review Trust and Provenance', level: 'advanced' },
  { id: 'lifecycle', label: '9. Manage the Lifecycle', level: 'advanced' },
  { id: 'choose-path', label: '10. Choose an Installation Path', level: 'advanced' },
  { id: 'further-reading', label: '11. Further Reading' },
] as const

export const installLayers: readonly InstallLayer[] = [
  {
    name: 'Primitive',
    job: 'Defines one useful capability or behavior.',
    examples: 'AGENTS.md, SKILL.md, hooks, agents, MCP servers',
  },
  {
    name: 'Package format',
    job: 'Groups related components into one portable unit.',
    examples: 'Agent Plugins 1.0, provider-native plugins',
  },
  {
    name: 'Registry or marketplace',
    job: 'Helps people discover packages and publishers.',
    examples: 'Awesome Copilot, Claude marketplaces, Cursor Marketplace, MCP Registry',
  },
  {
    name: 'Installer or package manager',
    job: 'Places, pins, updates, audits, or removes packages.',
    examples: 'Native plugin managers, npx skills, APM',
  },
  {
    name: 'Agent runtime',
    job: 'Loads the installed configuration and applies permissions.',
    examples: 'Copilot, Claude Code, Cursor, Codex',
  },
] as const

export const installUnits: readonly InstallUnit[] = [
  {
    need: 'One repository needs one rule',
    choose: 'A local instruction file',
    reason: 'No package manager is needed for a file the repository already owns.',
  },
  {
    need: 'One repeatable procedure should travel',
    choose: 'An Agent Skill',
    reason: 'A skill is the smallest portable workflow unit.',
  },
  {
    need: 'The agent needs one external service',
    choose: 'One MCP server',
    reason: 'Configure the server directly before adding another packaging layer.',
  },
  {
    need: 'A skill and its tools belong together',
    choose: 'An Agent Plugin',
    reason: 'The plugin keeps portable skills and MCP configuration in one package.',
  },
  {
    need: 'A team needs repeatable setup across repositories or harnesses',
    choose: 'A dependency manager such as APM',
    reason: 'A manifest and lockfile make installation reproducible and auditable.',
  },
] as const

export const nativeInstallProfiles: readonly NativeInstallProfile[] = [
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    tone: 'copilot',
    summary: 'Browse a registered marketplace, install a plugin, and manage it with Copilot CLI.',
    code: `copilot plugin marketplace list
copilot plugin marketplace browse awesome-copilot
copilot plugin install PLUGIN-NAME@awesome-copilot
copilot plugin list`,
    language: 'bash',
    filename: 'Terminal',
    sourceUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing',
  },
  {
    id: 'claude',
    label: 'Claude Code',
    tone: 'claude',
    summary: 'Use the plugin manager to inspect what a plugin adds, then choose user, project, or local scope.',
    code: `/plugin
/plugin install PLUGIN-NAME@claude-plugins-official
/reload-plugins`,
    language: 'text',
    filename: 'Claude Code',
    sourceUrl: 'https://code.claude.com/docs/en/discover-plugins',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    tone: 'cursor',
    summary: 'Open Customize, find the plugin, select Install, and choose project or user scope.',
    code: `Customize
  -> Plugins
  -> Select a plugin
  -> Install
  -> Choose project or user scope`,
    language: 'text',
    filename: 'Cursor',
    sourceUrl: 'https://cursor.com/docs/plugins',
  },
  {
    id: 'codex',
    label: 'OpenAI Codex',
    tone: 'codex',
    summary: 'Add and inspect marketplace sources from Codex; install and test listed plugins from the shared plugin directory.',
    code: `codex plugin marketplace add owner/repo
codex plugin marketplace list
codex plugin marketplace upgrade`,
    language: 'bash',
    filename: 'Terminal',
    sourceUrl: 'https://developers.openai.com/plugins/build/plugins',
  },
] as const

export const trustItems = [
  'Publisher and source repository',
  'Package manifest and files that will be installed',
  'Executable hooks and scripts',
  'Local MCP commands and remote MCP endpoints',
  'Credentials and data destinations',
  'Transitive dependencies',
  'Version or content pin',
  'Update, disable, removal, and rollback behavior',
] as const

export const lifecycleSteps = [
  ['Inspect', 'Review the package, publisher, components, scopes, and requested access.'],
  ['Install', 'Use the smallest appropriate scope and preserve the manifest or receipt.'],
  ['Verify', 'Confirm the expected skill, server, hook, or agent appears and nothing unexpected runs.'],
  ['Pin', 'Record a version, commit, lockfile, or content hash when reproducibility matters.'],
  ['Update', 'Review the incoming diff and changed permissions before accepting a new version.'],
  ['Audit', 'Check installed output against the declared package and organization policy.'],
  ['Disable', 'Stop loading a package while preserving a reversible path when the runtime supports it.'],
  ['Remove or roll back', 'Delete generated output safely or restore the last reviewed version.'],
] as const

export const installPaths: readonly InstallPath[] = [
  {
    path: 'Manual or repository-owned files',
    useWhen: 'You are learning, experimenting, or maintaining one small local primitive.',
    tradeoff: 'Simple and transparent, but copying across repositories creates drift.',
  },
  {
    path: 'npx skills',
    useWhen: 'You want to install a standalone Agent Skill from a public repository.',
    tradeoff: 'Convenient for skills, but not a complete project dependency or policy model.',
  },
  {
    path: 'Provider marketplace',
    useWhen: 'You want the provider to browse, install, enable, update, and remove its supported plugins.',
    tradeoff: 'Best native experience, but packaging and lifecycle details can remain provider-specific.',
  },
  {
    path: 'Agent Plugin',
    useWhen: 'Portable skills and MCP servers belong together as one package.',
    tradeoff: 'Portable package layout; installation, trust, and permissions remain client responsibilities.',
  },
  {
    path: 'APM',
    useWhen: 'A project or organization needs repeatable multi-harness installs, pins, audit, and policy.',
    tradeoff: 'Adds a manifest and generated outputs, which should be reviewed and maintained like dependencies.',
  },
  {
    path: 'MCP Registry',
    useWhen: 'You need to discover an MCP server before configuring it through a client or package manager.',
    tradeoff: 'A discovery source is not proof that a server is safe or appropriate for your data.',
  },
] as const

export const codeSamples = {
  reviewChecklist: `Before installing:

1. Open the source repository.
2. Read the package manifest.
3. List every skill, hook, script, and MCP server.
4. Identify requested credentials and data destinations.
5. Choose the narrowest installation scope.
6. Pin a reviewed version when the setup must be reproducible.`,
  pluginLayout: `reports-plugin/
├── plugin.json
├── skills/
│   └── summarize/
│       └── SKILL.md
├── mcp.json
└── com.github.copilot/
    ├── agents/
    └── hooks/`,
  pluginManifest: `{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "reports-plugin",
  "version": "1.0.0",
  "description": "Reporting workflows and tools"
}`,
  apmManifest: `name: my-project
version: 1.0.0
targets:
  - copilot
  - claude
  - cursor
  - codex
dependencies:
  apm:
    - example/reviewed-agent-package#v1.2.0
  mcp:
    - io.github.github/github-mcp-server`,
  apmCommands: `apm install
apm outdated
apm update
apm audit --ci`,
} as const

export const furtherReadingLinks: readonly ReadingLink[] = [
  {
    title: 'Agent Plugins specification',
    url: 'https://agent-plugins.org/specification',
    source: 'Agent Plugins',
    description: 'The vendor-neutral package format for portable skills and MCP servers.',
  },
  {
    title: 'Agent Package Manager',
    url: 'https://microsoft.github.io/apm/',
    source: 'Microsoft',
    description: 'Manifest, lockfile, install, integrity, and policy tooling across agent harnesses.',
  },
  {
    title: 'Agent Skills specification',
    url: 'https://agentskills.io/specification',
    source: 'Agent Skills',
    description: 'The portable format used for procedures packaged alone or inside plugins.',
  },
  {
    title: 'Model Context Protocol',
    url: 'https://modelcontextprotocol.io/',
    source: 'MCP',
    description: 'The open protocol used by packaged and standalone tool integrations.',
  },
  {
    title: 'GitHub Copilot plugin installation',
    url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing',
    source: 'GitHub',
    description: 'Marketplace, install, update, and uninstall commands for Copilot CLI.',
  },
  {
    title: 'Claude Code plugin discovery',
    url: 'https://code.claude.com/docs/en/discover-plugins',
    source: 'Anthropic',
    description: 'Plugin marketplaces, install scopes, component review, and management in Claude Code.',
  },
  {
    title: 'Cursor plugins',
    url: 'https://cursor.com/docs/plugins',
    source: 'Cursor',
    description: 'Agent Plugins, Cursor Plugins, marketplaces, installation scopes, and management.',
  },
  {
    title: 'OpenAI plugin packaging',
    url: 'https://developers.openai.com/plugins/build/plugins',
    source: 'OpenAI',
    description: 'Plugin packaging, marketplace sources, and Codex authoring commands.',
  },
] as const
