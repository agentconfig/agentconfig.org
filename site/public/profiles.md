# Provider Compatibility Profiles

Per-provider view of every primitive tracked on agentconfig.org: support level, implementation,
file location, and a citation to the provider's own documentation where one exists. Generated
directly from the same typed model that powers the homepage comparison table, so the two views
can never drift apart.

## GitHub Copilot

Coverage: 13 primitives tracked — 12 full, 1 partial, 0 DIY/manual. 12 of 13 cited to provider documentation.

### Instructions

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Persistent Instructions | full | AGENTS.md or repository instructions file | `AGENTS.md or .github/copilot-instructions.md` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |
| User Scope Instructions | full | User-level Copilot CLI instruction files | `$HOME/.copilot/copilot-instructions.md, $HOME/.copilot/instructions/**/*.instructions.md` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) |
| Directory / Path Scope Instructions | full | Nested AGENTS.md or applyTo instruction files | `subdir/AGENTS.md, .github/instructions/**/*.instructions.md` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |

### Procedures

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Skills / Workflows | full | Skill modules in skills directory | `.github/skills/<name>/SKILL.md (also .claude/skills, .agents/skills; personal: ~/.copilot/skills, ~/.agents/skills)` | [Provider documentation](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) |
| Slash Commands | full | Prompt files invoked via / commands | `.github/prompts/*.prompt.md` | — |

### Tools & Context

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Tool Integrations (MCP) | full | MCP servers and tool calling | `.vscode/mcp.json, VS Code settings.json (also Visual Studio, JetBrains IDEs, Xcode, Eclipse)` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp) |

### Delegation

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Agent Mode | full | Agent mode in Copilot Chat | `agent mode in your IDE` | [Provider documentation](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) |
| Custom Agents | full | Agent definition files | `.github/agents/*.agent.md` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-custom-agents-in-your-ide) |

### Control & Approval

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Permissions & Guardrails | full | Org policies and tool permissions | `Organization or repository Settings > Copilot > Internet access` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) |
| Lifecycle Hooks | full | Lifecycle hooks for Copilot CLI and cloud agent | `.github/hooks/*.json, ~/.copilot/hooks/*.json` | [Provider documentation](https://docs.github.com/en/copilot/reference/hooks-reference) |
| Runtime Sandbox | partial | Policy and execution constraints in agent runtime and org settings | `Organization or repository Settings > Copilot > Internet access` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) |

### Distribution

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Configuration Distribution | full | Repository plus nested AGENTS.md with optional .instructions.md files | `AGENTS.md, .github/copilot-instructions.md, .github/instructions/**/*.instructions.md` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |

### Verification & Observability

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Verification / Evals | full | Run tests/lint via terminal tools | `Copilot cloud agent Bash tool` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) |

## Claude Code

Coverage: 13 primitives tracked — 13 full, 0 partial, 0 DIY/manual. 12 of 13 cited to provider documentation.

### Instructions

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Persistent Instructions | full | Project memory file with @imports | `./CLAUDE.md, ./.claude/CLAUDE.md` | [Provider documentation](https://code.claude.com/docs/en/memory) |
| User Scope Instructions | full | User-level memory and config | `~/.claude/CLAUDE.md` | [Provider documentation](https://code.claude.com/docs/en/memory) |
| Directory / Path Scope Instructions | full | Rule files with globs frontmatter | `.claude/rules/*.md` | [Provider documentation](https://code.claude.com/docs/en/memory) |

### Procedures

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Skills / Workflows | full | Skill modules in .claude directory | `.claude/skills/<name>/SKILL.md (also ~/.claude/skills/<name>/SKILL.md for personal skills)` | [Provider documentation](https://code.claude.com/docs/en/skills) |
| Slash Commands | full | Command files with frontmatter and $ARGUMENTS | `.claude/commands/*.md` | — |

### Tools & Context

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Tool Integrations (MCP) | full | MCP servers and tool calling | `.mcp.json or ~/.claude.json` | [Provider documentation](https://code.claude.com/docs/en/mcp) |

### Delegation

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Agent Mode | full | Agentic workflows in Claude Code | `Claude Code` | [Provider documentation](https://code.claude.com/docs/en/sub-agents) |
| Custom Agents | full | Custom subagents with roles and tool permissions | `.claude/agents/*.md, ~/.claude/agents/*.md` | [Provider documentation](https://code.claude.com/docs/en/sub-agents) |

### Control & Approval

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Permissions & Guardrails | full | Allow/deny lists with pattern matching and sandbox | `.claude/settings.json, .claude/settings.local.json, ~/.claude/settings.json` | [Provider documentation](https://code.claude.com/docs/en/settings) |
| Lifecycle Hooks | full | Lifecycle hooks configured in shared project settings | `.claude/settings.json, ~/.claude/settings.json, .claude/settings.local.json` | [Provider documentation](https://code.claude.com/docs/en/hooks) |
| Runtime Sandbox | full | Sandboxing and command allow/deny controls | `.claude/settings.json, .claude/settings.local.json, ~/.claude/settings.json` | [Provider documentation](https://code.claude.com/docs/en/settings) |

### Distribution

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Configuration Distribution | full | Shared AGENTS.md imported into CLAUDE.md plus scoped rules files | `~/.claude/CLAUDE.md, ./CLAUDE.md, ./.claude/CLAUDE.md, ./CLAUDE.local.md, .claude/rules/*.md` | [Provider documentation](https://code.claude.com/docs/en/memory) |

### Verification & Observability

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Verification / Evals | full | Run tests/lint via Bash tool with hooks | `Bash tool + hooks` | [Provider documentation](https://code.claude.com/docs/en/hooks) |

## Cursor

Coverage: 13 primitives tracked — 13 full, 0 partial, 0 DIY/manual. 9 of 13 cited to provider documentation.

### Instructions

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Persistent Instructions | full | Project instructions file | `AGENTS.md` | [Provider documentation](https://cursor.com/docs/context/rules) |
| User Scope Instructions | full | User-level settings and preferences | `User Rules (global to your Cursor environment; not stored on the file system)` | [Provider documentation](https://cursor.com/docs/skills) |
| Directory / Path Scope Instructions | full | Rules with path patterns | `.cursor/rules/*.mdc` | [Provider documentation](https://cursor.com/docs/context/rules) |

### Procedures

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Skills / Workflows | full | Skill modules as portable, reusable packages | `.cursor/skills/<name>/SKILL.md (also discovers .agents/skills, .claude/skills, .codex/skills, and their ~/ personal equivalents)` | [Provider documentation](https://cursor.com/docs/skills) |
| Slash Commands | full | Custom commands with parameters and reusable workflows | `.cursor/commands/*.md` | — |

### Tools & Context

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Tool Integrations (MCP) | full | MCP servers with stdio, SSE, and Streamable HTTP transports | `.cursor/mcp.json, ~/.cursor/mcp.json` | [Provider documentation](https://cursor.com/docs/context/mcp) |

### Delegation

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Agent Mode | full | Cursor Agent mode for multi-step execution | `Agent (Chat) and Cloud Agents` | [Provider documentation](https://cursor.com/docs/agent/hooks) |
| Custom Agents | full | Subagents with model selection and context isolation | `.cursor/agents/*.md` | — |

### Control & Approval

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Permissions & Guardrails | full | Approvals, .cursorignore, LLM safety controls, and security hooks | `Settings > Agents > Approvals & Execution, .cursorignore, permissions.json, sandbox.json` | [Provider documentation](https://cursor.com/docs/agent/security/run-modes) |
| Lifecycle Hooks | full | Session, execution, and file operation hooks | `.cursor/hooks.json` | [Provider documentation](https://cursor.com/docs/agent/hooks) |
| Runtime Sandbox | full | Run modes with sandboxing, plus allow/deny permissions | `Settings > Agents > Approvals & Execution, permissions.json, sandbox.json` | [Provider documentation](https://cursor.com/docs/agent/security/run-modes) |

### Distribution

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Configuration Distribution | full | Project instructions, rules, and reusable skills packages | `AGENTS.md, .cursor/rules/*.mdc, .cursor/skills/*/SKILL.md` | — |

### Verification & Observability

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Verification / Evals | full | Integrated terminal for test execution | `Cursor Editor integrated terminal` | — |

## OpenAI Codex

Coverage: 13 primitives tracked — 13 full, 0 partial, 0 DIY/manual. 13 of 13 cited to provider documentation.

### Instructions

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Persistent Instructions | full | Project AGENTS.md file with hierarchical loading | `AGENTS.md, AGENTS.override.md` | [Provider documentation](https://developers.openai.com/codex/agent-configuration/agents-md) |
| User Scope Instructions | full | User-level AGENTS.md with override precedence | `~/.codex/AGENTS.md, ~/.codex/AGENTS.override.md` | [Provider documentation](https://developers.openai.com/codex/agent-configuration/agents-md) |
| Directory / Path Scope Instructions | full | Nested AGENTS.md files with hierarchical merge | `subdir/AGENTS.md, subdir/AGENTS.override.md` | [Provider documentation](https://developers.openai.com/codex/agent-configuration/agents-md) |

### Procedures

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Skills / Workflows | full | Skill modules following agentskills.io specification | `.agents/skills/<name>/SKILL.md (repo scope, up to repo root); personal: ~/.agents/skills; admin: /etc/codex/skills` | [Provider documentation](https://developers.openai.com/codex/build-skills) |
| Slash Commands | full | Built-in / commands for session control | `Codex CLI /permissions command` | [Provider documentation](https://developers.openai.com/codex/cli) |

### Tools & Context

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Tool Integrations (MCP) | full | MCP servers with stdio and Streamable HTTP transports | `~/.codex/config.toml, .codex/config.toml` | [Provider documentation](https://developers.openai.com/codex/extend/mcp) |

### Delegation

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Agent Mode | full | Agentic coding with multi-step execution | `Codex CLI` | [Provider documentation](https://developers.openai.com/codex/cli) |
| Custom Agents | full | Subagent definitions with model selection and delegation | `.codex/agents/*.toml, ~/.codex/agents/*.toml` | [Provider documentation](https://developers.openai.com/codex/agent-configuration/subagents) |

### Control & Approval

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Permissions & Guardrails | full | Sandbox modes, approval policies, and admin-enforced requirements | `~/.codex/config.toml, .codex/config.toml, requirements.toml` | [Provider documentation](https://developers.openai.com/codex/config-file/config-reference) |
| Lifecycle Hooks | full | Lifecycle hooks (session, subagent, prompt, tool, compaction events) via hooks.json or config.toml | `~/.codex/hooks.json, .codex/hooks.json, ~/.codex/config.toml, .codex/config.toml` | [Provider documentation](https://developers.openai.com/codex/hooks) |
| Runtime Sandbox | full | Sandbox modes plus approval policies | `~/.codex/config.toml, .codex/config.toml, requirements.toml` | [Provider documentation](https://developers.openai.com/codex/config-file/config-reference) |

### Distribution

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Configuration Distribution | full | Hierarchical AGENTS.md with user+repo layering | `~/.codex/AGENTS.md, ~/.codex/AGENTS.override.md, AGENTS.md, AGENTS.override.md, subdir/AGENTS.md, subdir/AGENTS.override.md` | [Provider documentation](https://developers.openai.com/codex/agent-configuration/agents-md) |

### Verification & Observability

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Verification / Evals | full | Shell tool for running tests/lint in agent mode | `Codex CLI` | [Provider documentation](https://developers.openai.com/codex/cli) |

