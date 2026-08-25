# agentconfig.org

A reference guide for configuring AI coding assistants. Learn where config files go, what primitives each tool supports, and how to structure your projects for maximum AI effectiveness.

**Live site:** [agentconfig.org](https://agentconfig.org)

## What's Here

- **AI Primitives** — The 11 core configuration primitives (instructions, skills, agents, commands, etc.) that power AI coding assistants
- **Interactive File Tree** — Visual guide to where config files live, for both global (user home) and project-level configuration
- **Provider Comparison** — Side-by-side comparison of GitHub Copilot, Claude Code, Cursor, and OpenAI Codex support for each primitive

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
| Global settings | `~/.cursor/settings.json` |
| Project instructions | `.cursor/instructions.md` |
| Project rules | `.cursor/rules/<name>.md` |

### OpenAI Codex

| Type | Path |
|------|------|
| Global config | `~/.codex/config.toml` |
| Global instructions | `~/.codex/AGENTS.md` |
| Project instructions | `AGENTS.md` |
| Project skills | `.codex/skills/<skill-name>/SKILL.md` |
| Command rules | `~/.codex/rules/*.rules` |

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
