# Contributing to agentconfig.org

Thanks for your interest in contributing! This project tracks configuration paths and primitives for AI coding assistants like GitHub Copilot and Claude Code.

## Pull Requests Only

This project does not use GitHub Issues. If you find something wrong or want to suggest an improvement, please open a pull request directly.

## What to Contribute

### High Value

- **Corrections** — Fix incorrect file paths or outdated information
- **New primitives** — Add newly supported configuration options as tools evolve
- **New providers** — Add support for other AI coding assistants (Cursor, Windsurf, etc.)
- **Documentation** — Improve explanations, add examples

### Lower Priority

- Visual/styling changes (unless fixing accessibility issues)
- Refactoring without functional changes

## Development Setup

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Run tests
bun run test

# Type check
bun run typecheck

# Lint
bun run lint
```

## Project Structure

```
src/
├── data/
│   ├── fileTree.ts      # Global and project config paths
│   ├── primitives.ts    # The 9 AI primitives definitions
│   └── comparison.ts    # Provider comparison data
├── components/          # React components
└── App.tsx              # Main app layout
```

## Making Changes

1. Fork the repo
2. Create a branch (`git checkout -b fix/copilot-path`)
3. Make your changes
4. Ensure tests pass (`bun run test`)
5. Ensure linting passes (`bun run lint`)
6. Commit with a descriptive message
7. Open a pull request

## Commit Style

This project uses conventional commits:

```
feat: add new primitive for X
fix: correct Claude config path
docs: update README examples
```

## Questions?

Open a PR with your question in the description — we can discuss there.
