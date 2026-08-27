# Agent Instructions

Start with one useful project instruction file, then add provider-specific formats,
path-scoped rules, agent personas, file hierarchy, and monorepo strategies as needed.

## Tutorial Sections

- 1. Create One Useful File (beginner)
- 2. What Instructions Do (beginner)
- 3. The Six Core Sections (beginner)
- 4. Add Your User Preferences (intermediate)
- 5. Path-Scoped Instructions (intermediate)
- 6. Custom Agent Personas (intermediate)
- 7. File Hierarchy (advanced)
- 8. Monorepo Strategies (advanced)
- 9. Further Reading

## Section Details

### 1. Create One Useful Instruction File

Give your agent the commands and conventions it needs for the repository:

```markdown
# Project instructions

## Commands
- Install: `bun install`
- Test: `bun test`
- Build: `bun run build`

## Conventions
- Use TypeScript strict mode
- Run tests before committing
```

| Provider | Implementation | Documented location | Source |
|----------|----------------|---------------------|--------|
| GitHub Copilot | AGENTS.md or repository instructions file | AGENTS.md or .github/copilot-instructions.md | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |
| Claude Code | Project memory file with @imports | ./CLAUDE.md, ./.claude/CLAUDE.md | [Provider documentation](https://code.claude.com/docs/en/memory) |
| Cursor | Project instructions file | AGENTS.md | [Provider documentation](https://cursor.com/docs/context/rules) |
| OpenAI Codex | Project AGENTS.md file with hierarchical loading | AGENTS.md, AGENTS.override.md | [Provider documentation](https://developers.openai.com/codex/agent-configuration/agents-md) |

### 2. What Agent Instructions Do

Agent instructions are markdown files that teach AI coding assistants about your project.
They provide context about how to build, what conventions to follow, and where things live.

**Why Markdown?**
- Human readable: Team members can review and update easily
- Version controlled: Instructions evolve with your codebase
- Tool agnostic: Many AI tools read compatible formats
- No application runtime dependency: Instructions are documentation consumed by supporting agents

### 3. The Six Sections That Matter

[GitHub's analysis of more than 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) found that effective agent instructions cover:

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

### 4. Add Your User Preferences

Keep personal preferences separate from the project instructions shared with your team.

| Provider | Implementation | Documented location | Source |
|----------|----------------|---------------------|--------|
| GitHub Copilot | User-level Copilot CLI instruction files | $HOME/.copilot/copilot-instructions.md, $HOME/.copilot/instructions/**/*.instructions.md | [Provider documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) |
| Claude Code | User-level memory and config | ~/.claude/CLAUDE.md | [Provider documentation](https://code.claude.com/docs/en/memory) |
| Cursor | User-level settings and preferences | User Rules (global to your Cursor environment; not stored on the file system) | [Provider documentation](https://cursor.com/docs/skills) |
| OpenAI Codex | User-level AGENTS.md with override precedence | ~/.codex/AGENTS.md, ~/.codex/AGENTS.override.md | [Provider documentation](https://developers.openai.com/codex/agent-configuration/agents-md) |

**Recommendation:** If your assistants support `AGENTS.md`, start there for shared team instructions.
Add provider-specific files only when you need unique capabilities such as Claude imports,
Copilot agents, or dedicated path-scoped rule formats.

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
diverge. Providers that support this walk from the root toward the current file, but how they
reconcile broad and specific files varies: some concatenate every applicable file into context
(broadest first), while others give the nearest file precedence. Check each provider's own
precedence rules below rather than assuming one universal merge order.

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
