# Provider Compatibility Profiles

Per-provider view of every primitive tracked on agentconfig.org: support level, implementation,
file location, and a citation to the provider's own documentation where one exists. Generated
directly from the same typed model that powers the homepage comparison table, so the two views
can never drift apart.

## GitHub Copilot

Coverage: 13 primitives tracked — 12 full, 1 partial, 0 DIY/manual. 7 of 13 cited to provider documentation.

### Instructions

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Persistent Instructions | full | AGENTS.md or repository instructions file | `AGENTS.md or .github/copilot-instructions.md` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |
| User Scope Instructions | full | User-level settings in VS Code | `VS Code settings.json` | — |
| Directory / Path Scope Instructions | full | Nested AGENTS.md or applyTo instruction files | `subdir/AGENTS.md or .github/instructions/*.instructions.md` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |

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
| Agent Mode | full | Agent mode in Copilot Chat | `VS Code Copilot Chat` | — |
| Custom Agents | full | Agent definition files | `.github/agents/*.agent.md` | — |

### Control & Approval

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Permissions & Guardrails | full | Org policies and tool permissions | `VS Code settings + org policies` | — |
| Lifecycle Hooks | full | Lifecycle hooks for Copilot CLI and cloud agent | `.github/hooks/*.json, ~/.copilot/hooks/*.json` | [Provider documentation](https://docs.github.com/en/copilot/reference/hooks-reference) |
| Runtime Sandbox | partial | Policy and execution constraints in agent runtime and org settings | `Copilot policy/settings surfaces` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) |

### Distribution

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Configuration Distribution | full | Repository plus nested AGENTS.md with optional .instructions.md files | `AGENTS.md and .github/instructions/*.instructions.md` | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |

### Verification & Observability

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Verification / Evals | full | Run tests/lint via terminal tools | `Terminal tools in agent mode` | — |

## Claude Code

Coverage: 13 primitives tracked — 13 full, 0 partial, 0 DIY/manual. 5 of 13 cited to provider documentation.

### Instructions

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Persistent Instructions | full | Project memory file with @imports | `CLAUDE.md` | — |
| User Scope Instructions | full | User-level memory and config | `~/.claude/CLAUDE.md` | — |
| Directory / Path Scope Instructions | full | Rule files with globs frontmatter | `.claude/rules/*.md` | — |

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
| Agent Mode | full | Agentic workflows in Claude Code | `Claude Code CLI` | — |
| Custom Agents | full | Custom subagents with roles and tool permissions | `.claude/agents/*.md` | — |

### Control & Approval

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Permissions & Guardrails | full | Allow/deny lists with pattern matching and sandbox | `.claude/settings.json` | — |
| Lifecycle Hooks | full | Lifecycle hooks configured in shared project settings | `.claude/settings.json, ~/.claude/settings.json, .claude/settings.local.json` | [Provider documentation](https://code.claude.com/docs/en/hooks) |
| Runtime Sandbox | full | Sandboxing and command allow/deny controls | `.claude/settings.json` | [Provider documentation](https://code.claude.com/docs/en/settings) |

### Distribution

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Configuration Distribution | full | Shared AGENTS.md imported into CLAUDE.md plus scoped rules files | `AGENTS.md, CLAUDE.md, .claude/rules/*.md` | [Provider documentation](https://code.claude.com/docs/en/memory) |

### Verification & Observability

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Verification / Evals | full | Run tests/lint via Bash tool with hooks | `Bash tool + hooks` | — |

## Cursor

Coverage: 13 primitives tracked — 13 full, 0 partial, 0 DIY/manual. 5 of 13 cited to provider documentation.

### Instructions

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Persistent Instructions | full | Project instructions file | `.cursor/instructions.md` | — |
| User Scope Instructions | full | User-level settings and preferences | `~/.cursor/settings.json` | — |
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
| Agent Mode | full | Cursor Agent mode for multi-step execution | `Cursor Editor with Agent capabilities` | — |
| Custom Agents | full | Subagents with model selection and context isolation | `.cursor/agents/*.md` | — |

### Control & Approval

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Permissions & Guardrails | full | Approvals, .cursorignore, LLM safety controls, and security hooks | `.cursor/settings.json + .cursorignore` | — |
| Lifecycle Hooks | full | Session, execution, and file operation hooks | `.cursor/hooks.json` | — |
| Runtime Sandbox | full | Run modes with sandboxing, plus allow/deny permissions | `Settings > Agents > Approvals & Execution + ~/.cursor/cli-config.json (global), .cursor/cli.json (project permissions override)` | [Provider documentation](https://cursor.com/docs/agent/security/run-modes) |

### Distribution

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Configuration Distribution | full | Project instructions, rules, and reusable skills packages | `.cursor/instructions.md, .cursor/rules/*.mdc, .cursor/skills/*/SKILL.md` | [Provider documentation](https://cursor.com/docs/skills) |

### Verification & Observability

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Verification / Evals | full | Integrated terminal for test execution | `Cursor Editor integrated terminal` | — |

## OpenAI Codex

Coverage: 13 primitives tracked — 13 full, 0 partial, 0 DIY/manual. 6 of 13 cited to provider documentation.

### Instructions

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Persistent Instructions | full | Project AGENTS.md file with hierarchical loading | `AGENTS.md` | — |
| User Scope Instructions | full | User-level AGENTS.md and config.toml | `~/.codex/AGENTS.md` | — |
| Directory / Path Scope Instructions | full | Nested AGENTS.md files with hierarchical merge | `subdir/AGENTS.md` | — |

### Procedures

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Skills / Workflows | full | Skill modules following agentskills.io specification | `.agents/skills/<name>/SKILL.md (repo scope, up to repo root); personal: ~/.agents/skills; admin: /etc/codex/skills` | [Provider documentation](https://developers.openai.com/codex/build-skills) |
| Slash Commands | full | Built-in / commands for session control | `Codex CLI / commands` | — |

### Tools & Context

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Tool Integrations (MCP) | full | MCP servers with stdio and Streamable HTTP transports | `~/.codex/config.toml, .codex/config.toml` | [Provider documentation](https://developers.openai.com/codex/extend/mcp) |

### Delegation

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Agent Mode | full | Agentic coding with multi-step execution | `Codex CLI` | — |
| Custom Agents | full | Subagent definitions with model selection and delegation | `.codex/agents/*.toml, ~/.codex/agents` | [Provider documentation](https://developers.openai.com/codex/agent-configuration/subagents) |

### Control & Approval

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Permissions & Guardrails | full | Sandbox modes, approval policies, and .rules files | `~/.codex/config.toml + ~/.codex/rules/*.rules` | — |
| Lifecycle Hooks | full | Lifecycle hooks (session, subagent, prompt, tool, compaction events) via hooks.json or config.toml | `~/.codex/hooks.json, <repo>/.codex/hooks.json, ~/.codex/config.toml, <repo>/.codex/config.toml` | [Provider documentation](https://developers.openai.com/codex/hooks) |
| Runtime Sandbox | full | Sandbox modes plus approval policies | `~/.codex/config.toml` | [Provider documentation](https://developers.openai.com/codex/config-file/config-reference) |

### Distribution

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Configuration Distribution | full | Hierarchical AGENTS.md with user+repo layering | `AGENTS.md, subdir/AGENTS.md, ~/.codex/AGENTS.md` | [Provider documentation](https://developers.openai.com/codex/agent-configuration/agents-md) |

### Verification & Observability

| Primitive | Support | Implementation | Location | Source |
|-----------|---------|-----------------|----------|--------|
| Verification / Evals | full | Shell tool for running tests/lint in agent mode | `Codex CLI shell tool` | — |

