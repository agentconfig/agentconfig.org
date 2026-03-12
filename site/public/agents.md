# Agent Definitions Tutorial

Tutorial for creating agent definition files (AGENTS.md, CLAUDE.md, copilot-instructions.md).
Covers provider-specific formats, path-scoped rules, agent personas, file hierarchy,
and monorepo strategies.

## Tutorial Sections

- 1. What Are Agent Definitions? (beginner)
- 2. Your First Definition (beginner)
- 3. The Six Core Sections (beginner)
- 4. Provider-Specific Formats (intermediate)
- 5. Path-Scoped Instructions (intermediate)
- 6. Custom Agent Personas (intermediate)
- 7. File Hierarchy (advanced)
- 8. Monorepo Strategies (advanced)
- 9. Further Reading

## Section Details

### 1. What Are Agent Definitions?

Agent definitions are markdown files that teach AI coding assistants about your project.
They provide context about how to build, what conventions to follow, and where things live.

The most popular format is AGENTS.md, an open standard used by over 60,000 projects and
supported by Claude Code, GitHub Copilot, Cursor, Aider, and others. When a tool supports it,
start with AGENTS.md as your baseline and add provider-specific files only for features unique
to that tool.

**Why Markdown?**
- Human readable: Team members can review and update easily
- Version controlled: Instructions evolve with your codebase
- Tool agnostic: Many AI tools read the same formats
- No runtime cost: Instructions load at session start

### 2. Your First Agent Definition

Minimal example that works with any AI coding assistant:

```markdown
# AGENTS.md

## Setup
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Run tests: `npm test`

## Code Style
- TypeScript strict mode
- Use functional components
- Single quotes, no semicolons
```

### 3. The Six Sections That Matter

Analysis of 2,500+ repositories shows effective agent definitions cover:

1. **Commands**: Build, test, lint with full flags
2. **Testing**: Framework, locations, how to run
3. **Project Structure**: Key directories mapped
4. **Code Style**: Actual code examples, not descriptions
5. **Git Workflow**: Branch naming, commit format, PR process
6. **Boundaries**: What the AI should NOT do

```markdown
# AGENTS.md

## Commands
- Build: `npm run build`
- Test: `npm test -- --coverage`
- Lint: `npm run lint --fix`

## Testing
- Framework: Vitest
- Location: `tests/` directory
- Run all: `npm test`
- Run one: `npm test -- -t "test name"`

## Project Structure
- `src/` - Application source code
- `tests/` - Test files (mirror src/ structure)
- `docs/` - Documentation
- `.github/` - CI/CD and GitHub config

## Code Style
- TypeScript strict mode
- Functional components with hooks
- Example:
  ```typescript
  // ✅ Good
  export function UserCard({ user }: Props): JSX.Element {
    return <div className="card">{user.name}</div>
  }
  
  // ❌ Bad  
  export default function(props: any) {
    return <div class="card">{props.user.name}</div>
  }
  ```

## Git Workflow
- Commit format: `type(scope): description`
- Types: feat, fix, docs, refactor, test
- Always run tests before committing

## Boundaries
- ✅ Always: Run tests, follow code style, use TypeScript
- ⚠️ Ask first: Database schema changes, new dependencies
- 🚫 Never: Commit secrets, modify node_modules, skip tests
```

### 4. Provider-Specific Formats

Start with the shared baseline, then layer in provider-specific features only where needed.

For assistants that support AGENTS.md, use it as the default team-wide definition file. Add
CLAUDE.md, .github/copilot-instructions.md, or other provider files when you need capabilities
that AGENTS.md does not cover on its own.

**AGENTS.md** (Open standard, 60k+ projects):
```markdown
# AGENTS.md

## Commands
- Build: `npm run build`
- Test: `npm test`

## Code Style
- TypeScript strict mode
- Use Prettier for formatting

## Testing
- Framework: Vitest
- Run: `npm test`
```

**CLAUDE.md** (Claude Code):
```markdown
# CLAUDE.md

See @README.md for project overview.
See @package.json for available npm commands.

## Code Style
Follow @docs/code-style.md for conventions.

## Testing
Run tests with `npm test` before every commit.

## Important Files
- @src/config.ts - Application configuration
- @src/types/index.ts - Shared TypeScript types
```

**copilot-instructions.md** (GitHub Copilot):
```markdown
# .github/copilot-instructions.md

This is a React 18 project using TypeScript and Vite.

When writing components:
- Use functional components with hooks
- Export named functions, not default exports
- Place tests in __tests__ directories
- Use Tailwind CSS for styling

When writing tests:
- Use Vitest and React Testing Library
- Test behavior, not implementation
- Include accessibility checks
```

| Feature | AGENTS.md | CLAUDE.md | copilot-instructions |
|---------|-----------|-----------|---------------------|
| Location | Project root | Root or .claude/ | .github/ |
| Path rules | ✗ | ✓ .claude/rules/ | ✓ .instructions.md |
| File imports | ✗ | ✓ @file syntax | ✗ |
| Agent personas | ✗ | ✗ | ✓ .agent.md |
| Cross-tool support | Wide | Claude only | Copilot only |

Recommendation: If your assistants support AGENTS.md, start there for shared team
instructions. Add provider-specific files only when you need unique capabilities like Claude
imports, Copilot agents, or dedicated path-scoped rule formats.

### 5. Path-Scoped Rules

Claude (.claude/rules/api.md):
```markdown
---
paths:
  - "src/api/**"
  - "src/routes/**"
---

# API Development Rules

When working in the API layer:
- All endpoints must have OpenAPI annotations
- Use zod for request/response validation
- Return proper HTTP status codes
- Log all errors with context
```

Copilot (.github/instructions/api.instructions.md):
```markdown
---
applyTo: "src/api/**"
---

# API Development Instructions

When modifying API endpoints:
- Follow REST naming conventions
- Include request validation
- Document all endpoints
- Write integration tests
```

### 6. Agent Personas (Copilot)

```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities and best practices
---

You are a security-focused code reviewer. Your job is to:

1. Identify potential security vulnerabilities
2. Check for OWASP Top 10 issues
3. Verify input validation and sanitization
4. Review authentication and authorization logic
5. Flag hardcoded secrets or credentials

When reviewing, be thorough but not alarmist. Explain why 
something is a concern and suggest specific fixes.
```

### 7. File Hierarchy & Precedence

**Claude Code:**
```
Precedence (highest to lowest):

1. Subtree CLAUDE.md (closest to working file)
2. Path-specific rules (.claude/rules/*.md)
3. Project CLAUDE.md (repository root)
4. User CLAUDE.md (~/.claude/CLAUDE.md)
5. Enterprise settings

More specific always wins. A rule in packages/api/CLAUDE.md
overrides the root CLAUDE.md for files in that package.
```

**GitHub Copilot:**
```
Precedence (highest to lowest):

1. Agent-specific (.agent.md instructions)
2. Path-specific (.instructions.md with applyTo)
3. Repository-wide (copilot-instructions.md)
4. Organization settings
5. User settings

Path rules are additive—they combine with repository
instructions rather than replacing them.
```

### 8. Monorepo Strategies

```
monorepo/
├── AGENTS.md           # Shared instructions (all packages)
├── .claude/
│   └── rules/
│       └── shared.md   # Shared Claude rules
├── packages/
│   ├── api/
│   │   ├── AGENTS.md   # API-specific overrides
│   │   └── CLAUDE.md   # Claude-specific for API
│   ├── web/
│   │   └── CLAUDE.md   # Claude-specific for web
│   └── shared/
│       └── AGENTS.md   # Shared library conventions
```

Root AGENTS.md:
```markdown
# AGENTS.md (monorepo root)

## Shared Commands
- Install all: `pnpm install`
- Build all: `pnpm build`
- Test all: `pnpm test`

## Workspace Commands
- Build one: `pnpm --filter <package> build`
- Test one: `pnpm --filter <package> test`

## Code Style (applies to all packages)
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits

## Git Workflow
- Branch from main
- PR required for all changes
- CI must pass before merge
```

Package-specific:
```markdown
# packages/api/AGENTS.md

## Package Info
This is the REST API package built with Express + TypeScript.

## Commands
- Start dev: `pnpm dev`
- Run tests: `pnpm test`
- Build: `pnpm build`

## Structure
- `src/routes/` - API route handlers
- `src/middleware/` - Express middleware
- `src/services/` - Business logic
- `tests/` - API tests

## API Conventions
- All endpoints require authentication middleware
- Use zod schemas for request validation
- Log all errors to the structured logger
```

## Further Reading

- [AGENTS.md Specification](https://agents.md): The open format for guiding coding agents, used by 60k+ open-source projects.
- [Claude Code Memory](https://docs.anthropic.com/en/docs/claude-code/memory): Official documentation for CLAUDE.md, rules, imports, and memory hierarchy.
- [Copilot Customization](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot): How to configure copilot-instructions.md, path-specific rules, and agent files.
- [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/): Lessons from analyzing 2,500+ repositories on effective agent configuration.
- [OpenAI AGENTS.md Repository](https://github.com/agentsmd/agents.md): The official specification and tools for the AGENTS.md open format.
