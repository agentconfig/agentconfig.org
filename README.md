# agentconfig.org

A reference guide for configuring AI coding assistants. Learn where config files go, what primitives each tool supports, and how to structure your projects for maximum AI effectiveness.

**Live site:** [agentconfig.org](https://agentconfig.org)

**✨ Works offline!** After your first visit, the entire site is cached locally. You can browse all pages, documentation, and guides even without an internet connection.

## What's Here

- **AI Primitives** — The 11 core configuration primitives (instructions, skills, agents, commands, etc.) that power AI coding assistants
- **Interactive File Tree** — Visual guide to where config files live, for both global (user home) and project-level configuration
- **Provider Comparison** — Side-by-side comparison of GitHub Copilot, Claude Code, Cursor, and OpenAI Codex support for each primitive

## Key Paths

### GitHub Copilot

| Type | Path |
|------|------|
| Global skills | `~/.copilot/skills/` or `~/.github/skills/` |
| Project instructions | `.github/copilot-instructions.md` |
| Project skills | `.github/skills/<skill-name>/SKILL.md` |
| Project agents | `.github/agents/<name>.agent.md` |

### Claude Code

| Type | Path |
|------|------|
| Global config | `~/.claude/` |
| Global memory | `~/.claude/CLAUDE.md` |
| Global commands | `~/.claude/commands/<name>.md` |
| Project memory | `./CLAUDE.md` or `.claude/CLAUDE.md` |
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
- Vite with vite-plugin-pwa (Progressive Web App support)
- Tailwind CSS v4
- Playwright for E2E tests
- Service worker with Workbox for offline caching

## Contributing

Contributions welcome! This project does not use GitHub Issues — if you notice anything incorrect or outdated, please open a pull request directly.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[ISC](LICENSE)
