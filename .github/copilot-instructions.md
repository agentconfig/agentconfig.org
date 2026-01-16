# Copilot Instructions for agentconfig.org

## Project Overview

This is a single-page React site explaining AI primitives for GitHub Copilot and Claude Code. The site helps developers understand where to place AI configuration files in their projects.

## Tech Stack

- **Runtime**: Bun (not npm)
- **Build**: Vite
- **Framework**: Preact 10+ with functional components and hooks
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Language**: TypeScript (strict mode)
- **Testing**: Playwright for E2E tests
- **Linting**: ESLint with strict config

## Code Standards

### TypeScript

- Always use strict TypeScript - no `any` types unless absolutely necessary
- Prefer `interface` over `type` for object shapes
- Use explicit return types on functions
- Use `readonly` for immutable data
- **No semicolons** - omit semicolons at end of statements

### React

- Use functional components only - no class components
- Prefer named exports over default exports
- Keep components small and focused (< 150 lines)
- Extract reusable logic into custom hooks in `src/hooks/`
- Use React.memo() for expensive components that receive stable props

### File Organization

- Source code lives in `site/` subdirectory
- Components live in `site/src/components/{ComponentName}/`
- Each component folder contains: `index.ts`, `{ComponentName}.tsx`, and optionally `{ComponentName}.test.tsx`
- Data/content lives in `site/src/data/`
- Hooks live in `site/src/hooks/`
- E2E tests live in `site/tests/e2e/`

### Styling

- Use Tailwind CSS utility classes
- Use CSS variables for theming (light/dark mode)
- Mobile-first responsive design
- Use shadcn/ui components where appropriate

### Testing

- Write Playwright E2E tests for all user interactions
- Test file naming: `{feature}.spec.ts`
- Tests should be independent and not rely on each other
- Test both light and dark modes for visual features
- Test responsive behavior at mobile/tablet/desktop breakpoints

## Commit Guidelines

**CRITICAL**: Follow semantic commit conventions strictly.

Format: `<type>(<scope>): <description>`

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code restructuring, no behavior change
- `test` - Adding or updating tests
- `chore` - Maintenance, config, dependencies

Rules:
1. Keep commits atomic - one logical change per commit
2. Minimize files per commit - prefer multiple small commits over one large commit
3. Write clear, descriptive commit messages
4. Always include scope when applicable
5. Description should complete: "This commit will..."

Good examples:
- `feat(file-tree): add collapsible tree node component`
- `test(navigation): add smooth scroll behavior tests`
- `chore(deps): add playwright dependency`
- `fix(theme): correct dark mode background color`

Bad examples:
- `update stuff` (vague)
- `feat: add file tree and cards and recipes` (too many changes)
- `WIP` (incomplete)

## Verification Checklist

Before considering any task complete, verify:

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
- Accent: Subtle neon (cyan, magenta) - not too intense
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

## File References

Key files to understand the project:
- `site/src/App.tsx` - Main application component
- `site/src/data/` - Content data (primitives, file trees, comparison)
- `site/tests/e2e/` - Playwright test files
- `site/src/index.css` - Tailwind CSS 4 theme configuration

## Contributors

- **Jonathan Hoyt** (jon, jonathan, jonmagic): `Jonathan Hoyt <jonmagic@gmail.com>`
- **Francis Brero** (francis, francisfuzz): `francisfuzz <15894826+francisfuzz@users.noreply.github.com>`

When a contributor asks you to commit and mentions they paired or worked with another contributor (by name or alias), include a `Co-authored-by:` trailer in the commit message body.

**Important**: Only add `Co-authored-by` for human contributors listed above. Never add AI agents (Claude, Copilot, ChatGPT, etc.) as co-authors.

Example:
```
feat(hero): update tagline

Co-authored-by: francisfuzz <15894826+francisfuzz@users.noreply.github.com>
```
