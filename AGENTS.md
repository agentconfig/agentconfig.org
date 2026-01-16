# Agent Instructions for agentconfig.org

This file is the authoritative source for AI agent instructions in this repository.
Both GitHub Copilot and Claude Code read this file automatically.

## Project Overview

A single-page educational website (agentconfig.org) explaining AI primitives—the configuration files and patterns developers use to customize AI coding assistants like GitHub Copilot and Claude Code.

### Target Audience

Developers who want to:
- Understand what AI primitive files exist (CLAUDE.md, copilot-instructions.md, etc.)
- Know where to place these files in their projects
- Learn which primitives to use for different tasks

### The Four Visualizations

The site presents information in 4 different ways:
1. **Interactive File Tree** - Shows file locations visually
2. **Primitive Cards** - Concept-first view of the 11 core primitives
3. **Work Type Recipes** - Task-oriented recommendations
4. **Provider Matrix** - Side-by-side Copilot vs Claude comparison

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

Project-specific skills are in `.github/skills/`. These work with both Copilot and Claude Code.

| Skill | When to Use |
|-------|-------------|
| [create-component](.github/skills/create-component/SKILL.md) | Adding new UI components |
| [write-e2e-test](.github/skills/write-e2e-test/SKILL.md) | Creating Playwright tests |
| [add-primitive](.github/skills/add-primitive/SKILL.md) | Adding/updating primitive definitions |
| [theme-styling](.github/skills/theme-styling/SKILL.md) | Styling with Tailwind CSS 4 |
| [semantic-commit](.github/skills/semantic-commit/SKILL.md) | Creating commit messages |
| [co-author](.github/skills/co-author/SKILL.md) | Co-author attribution |

## Commit Guidelines

Follow semantic commit conventions. See [semantic-commit skill](.github/skills/semantic-commit/SKILL.md) for complete format, types, scopes, and examples.

**Quick reference:**
- Format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commits atomic—one logical change per commit

## Contributors

See [co-author skill](.github/skills/co-author/SKILL.md) for contributor list and co-author formatting rules.

**Quick rule:** Add `Co-authored-by:` trailer when pair programming. Never add AI agents as co-authors.

Before considering any task complete:

1. `bun run lint` - No errors or warnings
2. `bun run typecheck` - No TypeScript errors
3. `bun run test` - All Playwright tests pass
4. Manual check of responsive behavior
5. Manual check of light/dark modes

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

- `site/src/App.tsx` - Main application component
- `site/src/data/` - Content data (primitives, file trees, comparison)
- `site/tests/e2e/` - Playwright test files
- `site/src/index.css` - Tailwind CSS 4 theme configuration

## Content Source

The `/research` folder contains documentation about AI primitives:
- `05-ai-primitives-realistic-project-trees.md` - Primary source for file tree visualization
- `03-ai-primitives-playbook-and-provider-mapping.md` - Source for primitives and recipes
