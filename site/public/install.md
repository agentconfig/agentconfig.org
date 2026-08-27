# Packaging, Installing, and Sharing Agent Configuration

Use the smallest install unit that solves the problem, review executable and network-capable components before installing them, and keep enough version and provenance information to update or remove the configuration safely.

## Guide Sections

- 1. Install One Reviewed Package
- 2. Understand the Layers
- 3. Choose the Smallest Unit
- 4. Package Portable Components
- 5. Use Native Provider Installation
- 6. Make Setup Reproducible with APM
- 7. Choose Installation Scope
- 8. Review Trust and Provenance
- 9. Manage the Lifecycle
- 10. Choose an Installation Path
- 11. Further Reading

## 1. Install One Reviewed Package

Before running an installer, open the source, inspect the package contents, identify scripts, hooks, MCP executables, and remote endpoints, then confirm the destination and scope.

```bash
Before installing:

1. Open the source repository.
2. Read the package manifest.
3. List every skill, hook, script, and MCP server.
4. Identify requested credentials and data destinations.
5. Choose the narrowest installation scope.
6. Pin a reviewed version when the setup must be reproducible.
```

## 2. Understand the Layers

| Layer | Job | Examples |
|-------|-----|----------|
| Primitive | Defines one useful capability or behavior. | AGENTS.md, SKILL.md, hooks, agents, MCP servers |
| Package format | Groups related components into one portable unit. | Agent Plugins 1.0, provider-native plugins |
| Registry or marketplace | Helps people discover packages and publishers. | Awesome Copilot, Claude marketplaces, Cursor Marketplace, MCP Registry |
| Installer or package manager | Places, pins, updates, audits, or removes packages. | Native plugin managers, npx skills, APM |
| Agent runtime | Loads the installed configuration and applies permissions. | Copilot, Claude Code, Cursor, Codex |

## 3. Choose the Smallest Install Unit

| Need | Install unit | Why |
|------|--------------|-----|
| One repository needs one rule | A local instruction file | No package manager is needed for a file the repository already owns. |
| One repeatable procedure should travel | An Agent Skill | A skill is the smallest portable workflow unit. |
| The agent needs one external service | One MCP server | Configure the server directly before adding another packaging layer. |
| A skill and its tools belong together | An Agent Plugin | The plugin keeps portable skills and MCP configuration in one package. |
| A team needs repeatable setup across repositories or harnesses | A dependency manager such as APM | A manifest and lockfile make installation reproducible and auditable. |

## 4. Package Portable Components

Agent Plugins 1.0 defines a root `plugin.json`, portable skills under `skills/`, and portable MCP configuration in `mcp.json`. Client-specific components belong in reverse-domain namespaces rather than being mistaken for portable core behavior.

```text
reports-plugin/
├── plugin.json
├── skills/
│   └── summarize/
│       └── SKILL.md
├── mcp.json
└── com.github.copilot/
    ├── agents/
    └── hooks/
```

## 5. Use Native Provider Installation

### GitHub Copilot

Browse a registered marketplace, install a plugin, and manage it with Copilot CLI.

```bash
copilot plugin marketplace list
copilot plugin marketplace browse awesome-copilot
copilot plugin install PLUGIN-NAME@awesome-copilot
copilot plugin list
```

[Primary documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing)

### Claude Code

Use the plugin manager to inspect what a plugin adds, then choose user, project, or local scope.

```text
/plugin
/plugin install PLUGIN-NAME@claude-plugins-official
/reload-plugins
```

[Primary documentation](https://code.claude.com/docs/en/discover-plugins)

### Cursor

Open Customize, find the plugin, select Install, and choose project or user scope.

```text
Customize
  -> Plugins
  -> Select a plugin
  -> Install
  -> Choose project or user scope
```

[Primary documentation](https://cursor.com/docs/plugins)

### OpenAI Codex

Add and inspect marketplace sources from Codex; install and test listed plugins from the shared plugin directory.

```bash
codex plugin marketplace add owner/repo
codex plugin marketplace list
codex plugin marketplace upgrade
```

[Primary documentation](https://developers.openai.com/plugins/build/plugins)

## 6. Make Project Setup Reproducible with APM

APM resolves dependencies, writes `apm.lock.yaml`, deploys configuration to supported targets, and provides integrity and policy checks. It manages the installation plane; the provider runtime still controls permissions, sandboxing, tool approval, and model behavior.

```yaml
name: my-project
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
    - io.github.github/github-mcp-server
```

```bash
apm install
apm outdated
apm update
apm audit --ci
```

## 7. Choose Installation Scope

| Scope | Use it for | Commit? |
|-------|------------|---------|
| User | Personal tools and workflows used across projects | No credentials or machine-specific values |
| Repository | Shared packages every contributor should be able to restore | Commit reviewed manifests, lockfiles, or settings |
| Local repository | Machine-specific or experimental configuration | No |
| Organization or managed | Approved marketplaces, required plugins, allowlists, policy, and governed defaults | Commit only the organization-approved declaration |

## 8. Review Trust and Provenance

- Publisher and source repository
- Package manifest and files that will be installed
- Executable hooks and scripts
- Local MCP commands and remote MCP endpoints
- Credentials and data destinations
- Transitive dependencies
- Version or content pin
- Update, disable, removal, and rollback behavior

## 9. Manage the Lifecycle

1. **Inspect:** Review the package, publisher, components, scopes, and requested access.
2. **Install:** Use the smallest appropriate scope and preserve the manifest or receipt.
3. **Verify:** Confirm the expected skill, server, hook, or agent appears and nothing unexpected runs.
4. **Pin:** Record a version, commit, lockfile, or content hash when reproducibility matters.
5. **Update:** Review the incoming diff and changed permissions before accepting a new version.
6. **Audit:** Check installed output against the declared package and organization policy.
7. **Disable:** Stop loading a package while preserving a reversible path when the runtime supports it.
8. **Remove or roll back:** Delete generated output safely or restore the last reviewed version.

## 10. Choose an Installation Path

| Path | Best for | Watch for |
|------|----------|-----------|
| Manual or repository-owned files | You are learning, experimenting, or maintaining one small local primitive. | Simple and transparent, but copying across repositories creates drift. |
| npx skills | You want to install a standalone Agent Skill from a public repository. | Convenient for skills, but not a complete project dependency or policy model. |
| Provider marketplace | You want the provider to browse, install, enable, update, and remove its supported plugins. | Best native experience, but packaging and lifecycle details can remain provider-specific. |
| Agent Plugin | Portable skills and MCP servers belong together as one package. | Portable package layout; installation, trust, and permissions remain client responsibilities. |
| APM | A project or organization needs repeatable multi-harness installs, pins, audit, and policy. | Adds a manifest and generated outputs, which should be reviewed and maintained like dependencies. |
| MCP Registry | You need to discover an MCP server before configuring it through a client or package manager. | A discovery source is not proof that a server is safe or appropriate for your data. |

## 11. Further Reading

- [Agent Plugins specification](https://agent-plugins.org/specification): The vendor-neutral package format for portable skills and MCP servers.
- [Agent Package Manager](https://microsoft.github.io/apm/): Manifest, lockfile, install, integrity, and policy tooling across agent harnesses.
- [Agent Skills specification](https://agentskills.io/specification): The portable format used for procedures packaged alone or inside plugins.
- [Model Context Protocol](https://modelcontextprotocol.io/): The open protocol used by packaged and standalone tool integrations.
- [GitHub Copilot plugin installation](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing): Marketplace, install, update, and uninstall commands for Copilot CLI.
- [Claude Code plugin discovery](https://code.claude.com/docs/en/discover-plugins): Plugin marketplaces, install scopes, component review, and management in Claude Code.
- [Cursor plugins](https://cursor.com/docs/plugins): Agent Plugins, Cursor Plugins, marketplaces, installation scopes, and management.
- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins): Plugin packaging, marketplace sources, and Codex authoring commands.
