import type { TocItem } from '@/components/TableOfContents'

export interface FurtherReadingLink {
  title: string
  url: string
  source: string
  description: string
}

export const tocItems: readonly TocItem[] = [
  { id: 'first-definition', label: '1. Create One Useful File', level: 'beginner' },
  { id: 'what-are-definitions', label: '2. What Instructions Do', level: 'beginner' },
  { id: 'six-sections', label: '3. The Six Core Sections', level: 'beginner' },
  { id: 'provider-formats', label: '4. Add Your User Preferences', level: 'intermediate' },
  { id: 'path-scoped', label: '5. Path-Scoped Instructions', level: 'intermediate' },
  { id: 'agent-personas', label: '6. Custom Agent Personas', level: 'intermediate' },
  { id: 'file-hierarchy', label: '7. File Hierarchy', level: 'advanced' },
  { id: 'monorepo', label: '8. Monorepo Strategies', level: 'advanced' },
  { id: 'further-reading', label: '9. Further Reading' },
] as const

export const furtherReadingLinks: readonly FurtherReadingLink[] = [
  {
    title: 'AGENTS.md Specification',
    url: 'https://agents.md',
    source: 'agents.md',
    description: 'The open format for guiding coding agents, used by 60k+ open-source projects.',
  },
  {
    title: 'Claude Code Memory',
    url: 'https://code.claude.com/docs/en/memory',
    source: 'Anthropic',
    description: 'Official documentation for CLAUDE.md, rules, imports, and memory hierarchy.',
  },
  {
    title: 'Copilot Customization',
    url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
    source: 'GitHub Docs',
    description: 'How to configure copilot-instructions.md, path-specific rules, and agent files.',
  },
  {
    title: 'How to write a great agents.md',
    url: 'https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/',
    source: 'GitHub Blog',
    description: 'Lessons from analyzing 2,500+ repositories on effective agent configuration.',
  },
  {
    title: 'OpenAI AGENTS.md Repository',
    url: 'https://github.com/agentsmd/agents.md',
    source: 'GitHub',
    description: 'The official specification and tools for the AGENTS.md open format.',
  },
] as const

// Markdown code samples for agent definitions
export const codeSamples: Record<string, string> = {
  minimalAgent: `# AGENTS.md

## Setup
- Install dependencies: \`npm install\`
- Start dev server: \`npm run dev\`
- Run tests: \`npm test\`

## Code Style
- TypeScript strict mode
- Use functional components
- Single quotes, no semicolons`,

  sixSections: `# AGENTS.md

## Commands
- Build: \`npm run build\`
- Test: \`npm test -- --coverage\`
- Lint: \`npm run lint --fix\`

## Testing
- Framework: Vitest
- Location: \`tests/\` directory
- Run all: \`npm test\`
- Run one: \`npm test -- -t "test name"\`

## Project Structure
- \`src/\` - Application source code
- \`tests/\` - Test files (mirror src/ structure)
- \`docs/\` - Documentation
- \`.github/\` - CI/CD and GitHub config

## Code Style
- TypeScript strict mode
- Functional components with hooks
- Example:
  \`\`\`typescript
  // ✅ Good
  export function UserCard({ user }: Props): JSX.Element {
    return <div className="card">{user.name}</div>
  }
  
  // ❌ Bad  
  export default function(props: any) {
    return <div class="card">{props.user.name}</div>
  }
  \`\`\`

## Git Workflow
- Commit format: \`type(scope): description\`
- Types: feat, fix, docs, refactor, test
- Always run tests before committing

## Boundaries
- ✅ Always: Run tests, follow code style, use TypeScript
- ⚠️ Ask first: Database schema changes, new dependencies
- 🚫 Never: Commit secrets, modify node_modules, skip tests`,

  agentsMdFormat: `# AGENTS.md

## Commands
- Build: \`npm run build\`
- Test: \`npm test\`

## Code Style
- TypeScript strict mode
- Use Prettier for formatting

## Testing
- Framework: Vitest
- Run: \`npm test\``,

  claudeMdFormat: `@AGENTS.md

## Claude Code

Add only Claude-specific instructions here. Shared project instructions
belong in AGENTS.md.`,

  copilotInstructions: `# .github/copilot-instructions.md

This is a React 18 project using TypeScript and Vite.

When writing components:
- Use functional components with hooks
- Export named functions, not default exports
- Place tests in __tests__ directories
- Use Tailwind CSS for styling

When writing tests:
- Use Vitest and React Testing Library
- Test behavior, not implementation
- Include accessibility checks`,

  claudeRules: `---
paths:
  - "src/api/**"
  - "src/routes/**"
---

# API Development Rules

When working in the API layer:
- All endpoints must have OpenAPI annotations
- Use zod for request/response validation
- Return proper HTTP status codes
- Log all errors with context`,

  copilotPathRules: `---
applyTo: "src/api/**"
---

# API Development Instructions

When modifying API endpoints:
- Follow REST naming conventions
- Include request validation
- Document all endpoints
- Write integration tests`,

  agentPersona: `---
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
something is a concern and suggest specific fixes.`,

  agentDirectory: `.github/
├── copilot-instructions.md     # Repository-wide instructions
├── instructions/
│   ├── api.instructions.md     # Rules for src/api/**
│   └── tests.instructions.md   # Rules for tests/**
└── agents/
    ├── security-reviewer.agent.md
    └── docs-writer.agent.md`,

  claudeHierarchy: `Instruction loading order (broadest to most specific):

1. Managed policy CLAUDE.md
2. User CLAUDE.md (~/.claude/CLAUDE.md)
3. Project CLAUDE.md or .claude/CLAUDE.md
4. CLAUDE.local.md
5. Nested CLAUDE.md files, loaded when Claude reads that subtree

Applicable files are concatenated into context. More specific files are read
later; they do not mechanically replace broader files.`,

  copilotHierarchy: `Instruction behavior:

1. The nearest AGENTS.md takes precedence among AGENTS.md files
2. Matching .instructions.md files are additive with repository instructions
3. Personal, repository, and organization instructions can all apply
4. Personal instructions have the highest priority, followed by repository
   instructions and then organization instructions

Avoid conflicts rather than relying on priority to reconcile them.`,

  monorepoStructure: `monorepo/
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
│       └── AGENTS.md   # Shared library conventions`,

  monorepoRoot: `# AGENTS.md (monorepo root)

## Shared Commands
- Install all: \`pnpm install\`
- Build all: \`pnpm build\`
- Test all: \`pnpm test\`

## Workspace Commands
- Build one: \`pnpm --filter <package> build\`
- Test one: \`pnpm --filter <package> test\`

## Code Style (applies to all packages)
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits

## Git Workflow
- Branch from main
- PR required for all changes
- CI must pass before merge`,

  monorepoPackage: `# packages/api/AGENTS.md

## Package Info
This is the REST API package built with Express + TypeScript.

## Commands
- Start dev: \`pnpm dev\`
- Run tests: \`pnpm test\`
- Build: \`pnpm build\`

## Structure
- \`src/routes/\` - API route handlers
- \`src/middleware/\` - Express middleware
- \`src/services/\` - Business logic
- \`tests/\` - API tests

## API Conventions
- All endpoints require authentication middleware
- Use zod schemas for request validation
- Log all errors to the structured logger`,

  symlinkSharing: `# Sharing rules with symlinks

# Create shared rules directory
mkdir -p shared-claude-rules

# Symlink from each package
ln -s ../../shared-claude-rules .claude/rules/shared

# Or symlink individual files
ln -s ~/company-standards/security.md .claude/rules/security.md`,
}
