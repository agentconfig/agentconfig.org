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

**Why Markdown?**
- Human readable: Team members can review and update easily
- Version controlled: Instructions evolve with your codebase
- Tool agnostic: Many AI tools read the same formats
- No application runtime dependency: Instructions are documentation consumed by supporting agents

### 2. Your First Agent Definition

Minimal example for assistants that support AGENTS.md:

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

Claude Code reads CLAUDE.md rather than AGENTS.md directly. Add a CLAUDE.md containing
`@AGENTS.md` to reuse these shared instructions with Claude Code.

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

**AGENTS.md** (open format):
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
@AGENTS.md

## Claude Code

Add only Claude-specific instructions here. Shared project instructions
belong in AGENTS.md.
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
| Path rules | ✓ nested AGENTS.md | ✓ .claude/rules/ | ✓ .instructions.md |
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

A common usage pattern is hierarchical AGENTS.md: keep broad repo defaults at the root, then add
nested AGENTS.md files in high-variance subtrees where ownership, build flows, or risk boundaries
diverge. Providers that support this walk up from the current file toward the root, applying the
most specific instructions first and falling back to broader ones.

**Claude Code:**
```
Instruction loading order (broadest to most specific):

1. Managed policy CLAUDE.md
2. User CLAUDE.md (~/.claude/CLAUDE.md)
3. Project CLAUDE.md or .claude/CLAUDE.md
4. CLAUDE.local.md
5. Nested CLAUDE.md files, loaded when Claude reads that subtree

Applicable files are concatenated into context. More specific files are read
later; they do not mechanically replace broader files.
```

**GitHub Copilot:**
```
Instruction behavior:

1. The nearest AGENTS.md takes precedence among AGENTS.md files
2. Matching .instructions.md files are additive with repository instructions
3. Personal, repository, and organization instructions can all apply
4. Personal instructions have the highest priority, followed by repository
   instructions and then organization instructions

Avoid conflicts rather than relying on priority to reconcile them.
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
- [Claude Code Memory](https://code.claude.com/docs/en/memory): Official documentation for CLAUDE.md, rules, imports, and memory hierarchy.
- [Copilot Customization](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions): How to configure copilot-instructions.md, path-specific rules, and agent files.
- [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/): Lessons from analyzing 2,500+ repositories on effective agent configuration.
- [OpenAI AGENTS.md Repository](https://github.com/agentsmd/agents.md): The official specification and tools for the AGENTS.md open format.
