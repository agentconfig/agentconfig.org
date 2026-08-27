# agentconfig.org

A reference guide for configuring AI coding assistants. Learn where config files go, what primitives each tool supports, and how to structure your projects for maximum AI effectiveness.

**Live site:** [agentconfig.org](https://agentconfig.org)

## What's Here

- **AI Primitives** — The 13 core configuration primitives for instructions, procedures, tools, delegation, guardrails, distribution, and verification
- **Interactive File Tree** — Visual guide to where config files live, for both global (user home) and project-level configuration
- **Provider Comparison** — Side-by-side comparison of GitHub Copilot, Claude Code, Cursor, and OpenAI Codex support for each primitive
- **Progressive Guides** — Practical tutorials for skills, agent definitions, lifecycle hooks, and MCP integrations
- **Install & Share** — Standards-first guidance for plugins, marketplaces, APM, trust, versioning, and lifecycle management
- **Provider Profiles** — Source-backed implementation paths and support details for each provider

## Key Paths

### GitHub Copilot

| Type | Path |
|------|------|
| Global skills | `~/.copilot/skills/` or `~/.agents/skills/` |
| Project instructions | `AGENTS.md` |
| Project skills | `.github/skills/<skill-name>/SKILL.md` |
| Project agents | `.github/agents/<name>.agent.md` |

### Claude Code

| Type | Path |
|------|------|
| Global config | `~/.claude/` |
| Global memory | `~/.claude/CLAUDE.md` |
| Global commands | `~/.claude/commands/<name>.md` |
| Project instructions | `CLAUDE.md`, importing `AGENTS.md` |
| Project skills | `.claude/skills/<skill-name>/SKILL.md` through a directory symlink |
| Project settings | `.claude/settings.json` |

### Cursor

| Type | Path |
|------|------|
| Global instructions | Cursor User Rules |
| Project instructions | `AGENTS.md` |
| Project rules | `.cursor/rules/<name>.mdc` |
| Project skills | `.cursor/skills/<skill-name>/SKILL.md` |
| Project hooks | `.cursor/hooks.json` |

### OpenAI Codex

| Type | Path |
|------|------|
| Global config | `~/.codex/config.toml` |
| Global instructions | `~/.codex/AGENTS.md` |
| Project instructions | `AGENTS.md` |
| Project skills | `.agents/skills/<skill-name>/SKILL.md` |
| Project agents | `.codex/agents/<name>.toml` |
| Project hooks | `.codex/hooks.json` |

## Repository Agent Harness

[`AGENTS.md`](AGENTS.md) is the canonical source of shared repository instructions. GitHub Copilot reads it directly, while [`CLAUDE.md`](CLAUDE.md) imports it with Claude Code's `@AGENTS.md` syntax. Project skills remain canonical in `.github/skills/`; the tracked `.claude/skills` directory symlink exposes the same files to Claude Code without maintaining duplicate copies.

See GitHub's [repository instruction documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) and Claude Code's [memory](https://code.claude.com/docs/en/memory) and [skills](https://code.claude.com/docs/en/skills) documentation for host-specific discovery behavior.

See the [llms.txt](https://agentconfig.org/llms.txt) for a machine-readable summary.

## Development

```bash
bun install
bun run dev
```

## Testing

```bash
bun run test
```

## Build

```bash
bun run build
```

## Tech Stack

- Preact + TypeScript
- Vite
- Tailwind CSS v4
- Playwright for E2E tests

## Contributing

Contributions welcome! This project does not use GitHub Issues — if you notice anything incorrect or outdated, please open a pull request directly.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[ISC](LICENSE)
