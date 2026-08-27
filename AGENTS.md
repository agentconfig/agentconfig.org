# Agent Instructions for agentconfig.org

This file is the authoritative source for AI agent instructions in this repository.
GitHub Copilot and other agents with `AGENTS.md` support read it directly. Claude Code loads the same instructions through the `@AGENTS.md` import in `CLAUDE.md`.

## Project Overview

A multi-page reference and tutorial site explaining the configuration files and patterns developers use to customize GitHub Copilot, Claude Code, Cursor, and OpenAI Codex.

### Target Audience

Developers who want to:
- Understand what AI primitive files exist (CLAUDE.md, copilot-instructions.md, etc.)
- Know where to place these files in their projects
- Learn which primitives to use for different tasks

### Site Structure

The site presents the same source-backed model in several ways:
1. **Homepage reference** - A practical starting example, 13 primitive cards, an interactive file tree, a four-provider comparison, and the scope model
2. **Progressive tutorials** - Skills, agent definitions, lifecycle hooks, and MCP guides that begin with a small working example before concepts and advanced cases
3. **Provider profiles** - Per-provider implementation, support, location, and primary-source documentation for every tracked primitive
4. **Machine-readable docs** - `llms.txt`, `llms-full.txt`, and page-specific Markdown generated from the same typed content

## Tech Stack

- **Runtime**: Bun (not npm)
- **Build**: Vite
- **Framework**: Preact 10+ with functional components and hooks
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Language**: TypeScript (strict mode)
- **Testing**: Playwright for E2E tests
- **Linting**: ESLint with strict config
- **Hosting**: GitHub Pages
- **Theme**: Light/dark mode support

## Commands

All commands run from the `site/` directory:

```bash
bun install          # Install dependencies
bun run dev          # Start development server (http://localhost:5173)
bun run build        # Production build
bun run preview      # Preview production build
bun run lint         # Run ESLint
bun run typecheck    # TypeScript type checking
bun run test         # Run Playwright E2E tests
```

### Local Preview

For every change that affects rendered pages, start the local Vite server and keep it running so @jonmagic can inspect the result:

```bash
bun run dev --host 127.0.0.1
```

Use `http://127.0.0.1:5173/` by default. If that port is unavailable, use the port Vite selects and report the exact URL. After making visual or content changes, verify the affected pages in the browser, then direct @jonmagic to the relevant local URL before asking for review. Do not stop the preview server at handoff unless @jonmagic asks.

## Code Standards

### TypeScript

- Always use strict TypeScript—no `any` types unless absolutely necessary
- Prefer `interface` over `type` for object shapes
- Use explicit return types on functions
- Use `readonly` for immutable data
- **No semicolons**—omit semicolons at end of statements

### Preact/React

- Use functional components only—no class components
- Prefer named exports over default exports
- Keep components small and focused (< 150 lines)
- Extract reusable logic into custom hooks in `site/src/hooks/`
- Use `memo()` for expensive components that receive stable props

### File Organization

- Source code lives in `site/` subdirectory
- Components: `site/src/components/{ComponentName}/`
- Each component folder contains: `index.ts`, `{ComponentName}.tsx`, optionally `{ComponentName}.test.tsx`
- Data/content: `site/src/data/`
- Hooks: `site/src/hooks/`
- E2E tests: `site/tests/e2e/`

### Styling

- Use Tailwind CSS utility classes
- Use CSS variables for theming (defined in `site/src/index.css`)
- Mobile-first responsive design
- Use shadcn/ui components where appropriate

### Testing

- Write Playwright E2E tests for all user interactions
- Test file naming: `{feature}.spec.ts`
- Tests should be independent and not rely on each other
- Test both light and dark modes for visual features
- Test responsive behavior at mobile/tablet/desktop breakpoints

## Skills

Project-specific skills have one canonical source in `.github/skills/`. Copilot discovers that directory directly. Claude Code discovers the same files through the tracked `.claude/skills` directory symlink; edit the canonical source rather than the symlink.

| Host | Discovery path | Source |
|------|----------------|--------|
| GitHub Copilot | `.github/skills/<skill-name>/SKILL.md` | Canonical |
| Claude Code | `.claude/skills/<skill-name>/SKILL.md` | `.claude/skills` links to canonical source |

| Skill | When to Use |
|-------|-------------|
| [create-component](.github/skills/create-component/SKILL.md) | Adding new UI components |
| [write-e2e-test](.github/skills/write-e2e-test/SKILL.md) | Creating Playwright tests |
| [add-primitive](.github/skills/add-primitive/SKILL.md) | Adding/updating primitive definitions |
| [refresh-provider-docs](.github/skills/refresh-provider-docs/SKILL.md) | Verifying published provider claims against authoritative documentation |
| [theme-styling](.github/skills/theme-styling/SKILL.md) | Styling with Tailwind CSS 4 |
| [semantic-commit](.github/skills/semantic-commit/SKILL.md) | Creating commit messages |
| [co-author](.github/skills/co-author/SKILL.md) | Co-author attribution |

## Multi-Agent Coordination

Multiple agents may work on this project simultaneously. To avoid conflicts:

### Agent Activity Log

A shared coordination file `.agent-activity.log` tracks what each agent is working on. This file is gitignored and append-only.

**Log format** (one entry per line):
```
<timestamp> <action> <agent-id> <resource> [message]
```

**Actions:**
- `LOCK` - Agent is claiming exclusive access to a resource
- `UNLOCK` - Agent is releasing a resource
- `WORKING` - Agent is actively working (no lock needed)
- `COMMIT_START` - Agent is beginning a commit (locks staging area)
- `COMMIT_END` - Agent has finished committing

**Examples:**
```
2026-01-16T18:30:00Z LOCK agent-abc123 site/src/components/Header/ starting header refactor
2026-01-16T18:45:00Z COMMIT_START agent-abc123 git-staging committing header changes
2026-01-16T18:45:30Z COMMIT_END agent-abc123 git-staging
2026-01-16T18:45:31Z UNLOCK agent-abc123 site/src/components/Header/
```

**Before starting work:**
1. Read the last 20 lines of `.agent-activity.log` (use `tail -20`)
2. Check if any `LOCK` entries exist without a corresponding `UNLOCK` for your target files
3. If locked, work on something else or wait
4. If clear, add your own `LOCK` or `WORKING` entry

**Before committing:**
1. Add a `COMMIT_START` entry to lock the staging area
2. Stage ONLY the files related to your specific change
3. Create the commit with proper semantic message
4. Add a `COMMIT_END` entry
5. Add `UNLOCK` entries for any files you had locked

### Stay In Your Lane

- Each agent should focus on a single, well-defined task
- Do not modify files another agent has locked
- Do not stage files that aren't part of your current task
- If you discover related work needed, note it but don't do it—let another agent handle it

### Commit Isolation

**Critical:** Each commit must contain ONLY files related to that specific change.

- Before `git add`, verify each file belongs to your current task
- Never use `git add .` or `git add -A`—always stage files explicitly
- If you accidentally stage unrelated files, unstage them before committing
- Use `git status` to review staged files before every commit

## Commit Guidelines

Follow semantic commit conventions. See [semantic-commit skill](.github/skills/semantic-commit/SKILL.md) for complete format, types, scopes, and examples.

**Quick reference:**
- Format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commits atomic—one logical change per commit

## Planning and Estimates

Do not estimate project duration, staffing, or delivery timelines unless @jonmagic explicitly asks. Prefer sequencing, dependencies, risks, decision gates, and assumptions.

## Contributors

See [co-author skill](.github/skills/co-author/SKILL.md) for contributor list and co-author formatting rules.

**Quick rule:** Add `Co-authored-by:` trailer when pair programming. Never add AI agents as co-authors.

Before considering any task complete:

1. `bun run lint` - No errors or warnings
2. `bun run typecheck` - No TypeScript errors
3. `bun run test` - All Playwright tests pass
4. Manual check of responsive behavior
5. Manual check of light/dark modes
6. For rendered changes, leave the local preview server running and give @jonmagic the exact page URL to review

## Design Guidelines

### Colors

**Light Mode:**
- Background: Off-white or light tan (not pure white)
- Use warm, friendly colors

**Dark Mode:**
- Background: Dark gray/charcoal
- Accent: Subtle neon (cyan, magenta)—not too intense
- Maintain good contrast ratios

### Typography

- Use system font stack for performance
- Clear hierarchy with distinct heading sizes
- Readable line lengths (max ~75 characters)

### Components

- Rounded corners for a friendly feel
- Adequate padding and whitespace
- Clear visual feedback on interactive elements
- Smooth transitions (150-300ms)

## Key Files

- `site/src/App.tsx` - Homepage application component
- `site/src/pages/` - Entry points for tutorial and profile pages
- `site/src/data/` - Typed content model for primitives, providers, tutorials, file trees, and comparison
- `site/tests/e2e/` - Playwright test files
- `site/src/index.css` - Tailwind CSS 4 theme configuration

## Content Source

The `/research` folder contains documentation about AI primitives:
- `05-ai-primitives-realistic-project-trees.md` - Primary source for file tree visualization
- `03-ai-primitives-playbook-and-provider-mapping.md` - Source for primitives and recipes
