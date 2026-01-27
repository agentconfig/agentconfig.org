export type Provider = 'copilot' | 'claude' | 'cursor' | 'codex'

export interface FileNode {
  /** Unique identifier for the node */
  id: string
  /** Display name */
  name: string
  /** Type of node */
  type: 'file' | 'folder'
  /** Child nodes (for folders) */
  children?: FileNode[]
  /** File details (for files with explanations) */
  details?: FileDetails
}

export interface FileDetails {
  /** Short label for the file type */
  label: string
  /** One-sentence description */
  description: string
  /** What content goes in this file */
  whatGoesHere: string[]
  /** When is it loaded/used */
  whenLoaded: string
  /** Position in load order */
  loadOrder: number
  /** Example content */
  example: string
}

export const copilotGlobalTree: FileNode = {
  id: 'copilot-global-root',
  name: '~',
  type: 'folder',
  children: [
    {
      id: 'copilot-global-dotcopilot',
      name: '.copilot',
      type: 'folder',
      children: [
        {
          id: 'copilot-global-skills',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'copilot-global-skill-git-pr',
              name: 'git-pr-workflow',
              type: 'folder',
              children: [
                {
                  id: 'copilot-global-skill-git-pr-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Global Skill',
                    description: 'A personal skill available across all your projects. Great for workflows you use everywhere.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Step-by-step instructions',
                      'Tool usage patterns',
                      'Common workflows you repeat across repos',
                    ],
                    whenLoaded: 'Auto-selected based on task. Available globally regardless of which project you\'re in.',
                    loadOrder: 1,
                    example: `---
name: "git-pr-workflow"
description: "Create well-formed PRs with conventional commits, proper descriptions, and linked issues. Use when creating or preparing pull requests."
---

# Git PR Workflow

## Before Creating PR
1. Ensure all commits follow conventional commit format
2. Rebase on latest main if needed
3. Run tests locally

## PR Description Template
- Summary of changes
- Link to related issue(s)
- Testing done
- Screenshots if UI changes

## Checklist
- [ ] Tests pass
- [ ] No console.log statements
- [ ] Documentation updated if needed`,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const copilotTree: FileNode = {
  id: 'copilot-root',
  name: 'my-project',
  type: 'folder',
  children: [
    {
      id: 'copilot-github',
      name: '.github',
      type: 'folder',
      children: [
        {
          id: 'copilot-instructions',
          name: 'copilot-instructions.md',
          type: 'file',
          details: {
            label: 'Repo Instructions',
            description: 'The primary file for repo-wide behavioral guidance. Copilot reads this automatically for every interaction.',
            whatGoesHere: [
              'Project overview and tech stack',
              'Coding conventions (naming, formatting, patterns)',
              'Testing requirements and how to run tests',
              'Build/deploy commands',
              'Security constraints',
            ],
            whenLoaded: 'Always loaded first. Forms the baseline context for all Copilot interactions.',
            loadOrder: 1,
            example: `# Copilot Instructions

## Tech Stack
- TypeScript, React 18, Node.js 20
- PostgreSQL with Prisma ORM

## Conventions
- Use functional components with hooks
- Prefer named exports
- All API endpoints return { data, error } shape

## Testing
- Run tests: \`npm test\`
- All PRs must have tests for new functionality`,
          },
        },
        {
          id: 'copilot-agents',
          name: 'agents',
          type: 'folder',
          children: [
            {
              id: 'copilot-agent-reviewer',
              name: 'reviewer.agent.md',
              type: 'file',
              details: {
                label: 'Custom Agent',
                description: 'Defines a specialized agent persona with specific roles, behaviors, and tool permissions.',
                whatGoesHere: [
                  'Agent name and description',
                  'Role definition (what it focuses on)',
                  'Allowed/disallowed tools',
                  'Specific instructions for behavior',
                ],
                whenLoaded: 'Loaded when you explicitly select this agent in Copilot Chat.',
                loadOrder: 5,
                example: `---
name: "Code Reviewer"
description: "Reviews code for correctness and style"
tools:
  - read_file
  - grep_search
---

# Code Reviewer Agent

You are a senior code reviewer. Your job is to:
1. Identify bugs and potential issues
2. Check adherence to project conventions
3. Suggest improvements (but don't make changes)`,
              },
            },
            {
              id: 'copilot-agent-planner',
              name: 'planner.agent.md',
              type: 'file',
              details: {
                label: 'Custom Agent',
                description: 'Defines a specialized agent persona with specific roles, behaviors, and tool permissions.',
                whatGoesHere: [
                  'Agent name and description',
                  'Role definition (what it focuses on)',
                  'Allowed/disallowed tools',
                  'Specific instructions for behavior',
                ],
                whenLoaded: 'Loaded when you explicitly select this agent in Copilot Chat.',
                loadOrder: 5,
                example: `---
name: "Implementation Planner"
description: "Plans implementation approach before coding"
---

# Implementation Planner Agent

Before writing any code, help the user:
1. Break down the task into steps
2. Identify potential challenges
3. Suggest the best approach`,
              },
            },
          ],
        },
        {
          id: 'copilot-skills',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'copilot-skill-debug-ci',
              name: 'debug-ci',
              type: 'folder',
              children: [
                {
                  id: 'copilot-skill-debug-ci-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Skill',
                    description: 'A reusable, multi-step workflow that Copilot can invoke automatically based on the task.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Step-by-step instructions',
                      'Tool usage patterns',
                      'Example inputs/outputs',
                    ],
                    whenLoaded: 'Auto-selected based on task. The skill description is matched against user requests.',
                    loadOrder: 6,
                    example: `---
name: "Debug CI Failures"
description: "Diagnose and fix failing CI runs"
---

# Debug CI Failures

## Steps
1. Check CI logs for error message
2. Reproduce locally
3. Identify common causes
4. Fix and verify`,
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'copilot-instructions-folder',
          name: 'instructions',
          type: 'folder',
          children: [
            {
              id: 'copilot-instructions-frontend',
              name: 'frontend.instructions.md',
              type: 'file',
              details: {
                label: 'Path-Specific',
                description: 'Instructions that apply only to specific directories or file patterns using glob patterns.',
                whatGoesHere: [
                  'Directory-specific conventions',
                  'Framework-specific guidance',
                  'Different rules for frontend vs backend',
                ],
                whenLoaded: 'Loaded when working on files matching the glob pattern in frontmatter.',
                loadOrder: 4,
                example: `---
applyTo: "frontend/**"
---

# Frontend Instructions

## React Conventions
- Use functional components only
- Extract reusable logic into custom hooks

## Testing
- Use React Testing Library
- Test behavior, not implementation`,
              },
            },
            {
              id: 'copilot-instructions-backend',
              name: 'backend.instructions.md',
              type: 'file',
              details: {
                label: 'Path-Specific',
                description: 'Instructions that apply only to specific directories or file patterns using glob patterns.',
                whatGoesHere: [
                  'Directory-specific conventions',
                  'Framework-specific guidance',
                  'API design patterns',
                ],
                whenLoaded: 'Loaded when working on files matching the glob pattern in frontmatter.',
                loadOrder: 4,
                example: `---
applyTo: "backend/**"
---

# Backend Instructions

## API Conventions
- RESTful endpoint naming
- Always validate input
- Return consistent error shapes`,
              },
            },
          ],
        },
        {
          id: 'copilot-prompts',
          name: 'prompts',
          type: 'folder',
          children: [
            {
              id: 'copilot-prompt-write-tests',
              name: 'write-tests.prompt.md',
              type: 'file',
              details: {
                label: 'Prompt Template',
                description: 'Reusable prompt templates for common tasks. Invoke via / commands in Copilot Chat.',
                whatGoesHere: [
                  'A well-crafted prompt for a repeatable task',
                  'File references with #file:',
                  'Variables like ${SELECTION}',
                ],
                whenLoaded: 'User-invoked only. Not automatically loaded.',
                loadOrder: 7,
                example: `---
name: "Write Tests"
description: "Generate unit tests for selected code"
---

Write comprehensive unit tests for:

#file:\${SELECTION}

Requirements:
- Cover happy path and edge cases
- Include at least one error case
- Follow AAA pattern (Arrange, Act, Assert)`,
              },
            },
            {
              id: 'copilot-prompt-review-pr',
              name: 'review-pr.prompt.md',
              type: 'file',
              details: {
                label: 'Prompt Template',
                description: 'Reusable prompt templates for common tasks. Invoke via / commands in Copilot Chat.',
                whatGoesHere: [
                  'A well-crafted prompt for a repeatable task',
                  'File references with #file:',
                  'Variables like ${SELECTION}',
                ],
                whenLoaded: 'User-invoked only. Not automatically loaded.',
                loadOrder: 7,
                example: `---
name: "Review PR"
description: "Generate a PR review checklist"
---

Review this PR for:
- [ ] Logic correctness
- [ ] Error handling
- [ ] Test coverage
- [ ] Security considerations`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'copilot-agents-md',
      name: 'AGENTS.md',
      type: 'file',
      details: {
        label: 'Cross-Tool Context',
        description: 'An open standard for AI agents. Works with Copilot, Cursor, Claude, and other tools.',
        whatGoesHere: [
          'How to build and run the project',
          'How to run tests',
          'Project structure overview',
          'Key conventions and commands',
        ],
        whenLoaded: 'Read by Copilot agent mode and other compatible tools. Loaded alongside repo instructions.',
        loadOrder: 2,
        example: `# AGENTS.md

## Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing
\`\`\`bash
npm test
\`\`\`

## Project Structure
- \`/src\` — Source code
- \`/tests\` — Test files`,
      },
    },
    {
      id: 'copilot-frontend',
      name: 'frontend',
      type: 'folder',
      children: [
        {
          id: 'copilot-frontend-agents',
          name: 'AGENTS.md',
          type: 'file',
          details: {
            label: 'Nested Context',
            description: 'Same as root AGENTS.md but scoped to this subdirectory. Provides additional context specific to this area.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Adds to (doesn\'t replace) root context.',
            loadOrder: 3,
            example: `# Frontend AGENTS.md

## Stack
- React 18 with TypeScript
- Vite for bundling

## Key Directories
- \`/src/components\` — UI components
- \`/src/hooks\` — Custom hooks`,
          },
        },
        {
          id: 'copilot-frontend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
    {
      id: 'copilot-backend',
      name: 'backend',
      type: 'folder',
      children: [
        {
          id: 'copilot-backend-agents',
          name: 'AGENTS.md',
          type: 'file',
          details: {
            label: 'Nested Context',
            description: 'Same as root AGENTS.md but scoped to this subdirectory. Provides additional context specific to this area.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Adds to (doesn\'t replace) root context.',
            loadOrder: 3,
            example: `# Backend AGENTS.md

## Stack
- Node.js with Express
- PostgreSQL with Prisma

## Key Directories
- \`/src/routes\` — API routes
- \`/src/services\` — Business logic`,
          },
        },
        {
          id: 'copilot-backend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
  ],
}

export const claudeTree: FileNode = {
  id: 'claude-root',
  name: 'my-project',
  type: 'folder',
  children: [
    {
      id: 'claude-dotclaude',
      name: '.claude',
      type: 'folder',
      children: [
        {
          id: 'claude-settings',
          name: 'settings.json',
          type: 'file',
          details: {
            label: 'Claude Settings',
            description: 'Configuration for Claude Code behavior including model selection and tool permissions.',
            whatGoesHere: [
              'Model preferences',
              'Tool permissions (allow/deny lists)',
              'MCP server configurations',
              'Sandbox settings',
            ],
            whenLoaded: 'Always loaded. Configures Claude\'s capabilities.',
            loadOrder: 3,
            example: `{
  "model": "claude-sonnet-4-20250514",
  "permissions": {
    "allow": ["Read", "Edit", "Bash(npm test)", "Bash(git commit:*)"],
    "deny": ["Bash(rm -rf /*)"]
  }
}`,
          },
        },
        {
          id: 'claude-agents-folder',
          name: 'agents',
          type: 'folder',
          children: [
            {
              id: 'claude-agent-reviewer',
              name: 'code-reviewer.md',
              type: 'file',
              details: {
                label: 'Custom Agent',
                description: 'Defines a specialized subagent with specific roles, behaviors, and tool permissions.',
                whatGoesHere: [
                  'Agent name and description (in frontmatter)',
                  'Allowed tools (comma-separated, optional - inherits all if omitted)',
                  'Behavioral instructions in body',
                ],
                whenLoaded: 'Loaded when Claude delegates to this subagent based on task matching.',
                loadOrder: 5,
                example: `---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability.
tools: Read, Grep, Glob, Bash
---

You are a code reviewer. When invoked:
1. Identify bugs and potential issues
2. Check adherence to project conventions
3. Suggest improvements (but don't make changes)`,
              },
            },
          ],
        },
        {
          id: 'claude-commands-folder',
          name: 'commands',
          type: 'folder',
          children: [
            {
              id: 'claude-command-commit',
              name: 'commit.md',
              type: 'file',
              details: {
                label: 'Slash Command',
                description: 'Custom slash command invoked with /commit. Supports arguments, bash execution, and file references.',
                whatGoesHere: [
                  'Command frontmatter (allowed-tools, description, model)',
                  'Bash commands with ! prefix',
                  'File references with @ prefix',
                  '$ARGUMENTS or $1, $2 for arguments',
                ],
                whenLoaded: 'User-invoked with /commit. Not automatically loaded.',
                loadOrder: 7,
                example: `---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit with conventional format
---

## Context
- Current git status: !\`git status\`

## Your task
Based on the staged changes, create a commit with conventional commit format.`,
              },
            },
          ],
        },
        {
          id: 'claude-rules-folder',
          name: 'rules',
          type: 'folder',
          children: [
            {
              id: 'claude-rule-api',
              name: 'api-guidelines.md',
              type: 'file',
              details: {
                label: 'Modular Rule',
                description: 'Topic-specific instructions that can be scoped to specific paths using glob patterns.',
                whatGoesHere: [
                  'Glob patterns in frontmatter (optional)',
                  'Focused, topic-specific instructions',
                  'Rules that apply to matching files only',
                ],
                whenLoaded: 'Loaded when working on files matching the globs pattern, or always if no globs specified.',
                loadOrder: 4,
                example: `---
globs:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Document endpoints with JSDoc comments`,
              },
            },
          ],
        },
        {
          id: 'claude-skills-folder',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'claude-skill-refactor',
              name: 'refactor',
              type: 'folder',
              children: [
                {
                  id: 'claude-skill-refactor-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Skill',
                    description: 'Reusable workflows Claude can invoke. Same concept as Copilot skills.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Step-by-step instructions',
                      'Tool usage patterns',
                    ],
                    whenLoaded: 'Auto-selected based on task matching.',
                    loadOrder: 6,
                    example: `---
name: "Safe Refactor"
description: "Refactor code while maintaining tests"
---

# Safe Refactoring

1. Run existing tests first
2. Make incremental changes
3. Run tests after each change
4. Commit working states`,
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'claude-hooks-folder',
          name: 'hooks',
          type: 'folder',
          children: [
            {
              id: 'claude-hooks-json',
              name: 'hooks.json',
              type: 'file',
              details: {
                label: 'Hooks Config',
                description: 'Defines lifecycle hooks that run before/after tool execution or on notifications.',
                whatGoesHere: [
                  'Hook event types (PreToolUse, PostToolUse, Stop, etc.)',
                  'Matcher patterns for specific tools (regex)',
                  'Commands to execute with optional timeout',
                ],
                whenLoaded: 'Hooks execute at their defined lifecycle points.',
                loadOrder: 0,
                example: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/validate-edit.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'claude-md',
      name: 'CLAUDE.md',
      type: 'file',
      details: {
        label: 'Project Memory',
        description: 'Claude\'s primary file for project context. Supports @path imports for modular organization.',
        whatGoesHere: [
          'Project overview and conventions',
          'Key commands (build, test, run)',
          'Architecture notes',
          '@path/to/file imports for additional context',
        ],
        whenLoaded: 'Always loaded first. Forms the baseline context for all Claude interactions.',
        loadOrder: 1,
        example: `# CLAUDE.md

## Project Overview
A web application built with React and Node.js.

## Commands
- \`npm run dev\` — Start development
- \`npm test\` — Run tests
- \`npm run build\` — Production build

## Conventions
- Use TypeScript strict mode
- Prefer functional patterns

@.claude/rules/api-guidelines.md`,
      },
    },
    {
      id: 'claude-local-md',
      name: 'CLAUDE.local.md',
      type: 'file',
      details: {
        label: 'Local Memory (Deprecated)',
        description: 'Personal project-specific preferences. Deprecated in favor of hierarchical CLAUDE.md loading from parent directories.',
        whatGoesHere: [
          'Your sandbox/dev environment URLs',
          'Personal testing preferences',
          'Local-only conventions',
        ],
        whenLoaded: 'Always loaded if present. Consider using parent directory CLAUDE.md files instead.',
        loadOrder: 2,
        example: `# My Local Preferences (Deprecated)

# Prefer using ~/.claude/CLAUDE.md for personal global preferences
# or CLAUDE.md in parent directories for hierarchical config.

## Dev Environment
- Local API: http://localhost:3000
- Test database: my_dev_db`,
      },
    },
    {
      id: 'claude-frontend',
      name: 'frontend',
      type: 'folder',
      children: [
        {
          id: 'claude-frontend-md',
          name: 'CLAUDE.md',
          type: 'file',
          details: {
            label: 'Nested Memory',
            description: 'Additional context for this directory. Claude reads this when working in this area.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Adds to root context.',
            loadOrder: 2,
            example: `# Frontend CLAUDE.md

## Stack
- React 18 with hooks
- TanStack Query for data fetching

## Patterns
- Components in /components
- Hooks in /hooks`,
          },
        },
        {
          id: 'claude-frontend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
    {
      id: 'claude-backend',
      name: 'backend',
      type: 'folder',
      children: [
        {
          id: 'claude-backend-md',
          name: 'CLAUDE.md',
          type: 'file',
          details: {
            label: 'Nested Memory',
            description: 'Additional context for this directory. Claude reads this when working in this area.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Adds to root context.',
            loadOrder: 2,
            example: `# Backend CLAUDE.md

## Stack
- Express.js API
- Prisma ORM

## Patterns
- Routes in /routes
- Services in /services`,
          },
        },
        {
          id: 'claude-backend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
  ],
}

export const claudeGlobalTree: FileNode = {
  id: 'claude-global-root',
  name: '~',
  type: 'folder',
  children: [
    {
      id: 'claude-global-dotclaude',
      name: '.claude',
      type: 'folder',
      children: [
        {
          id: 'claude-global-settings',
          name: 'settings.json',
          type: 'file',
          details: {
            label: 'Global Settings',
            description: 'Personal Claude Code settings that apply across all projects.',
            whatGoesHere: [
              'Default model preferences',
              'Global tool permissions',
              'Personal behavioral preferences',
            ],
            whenLoaded: 'Always loaded. Merged with project-level settings (project takes precedence).',
            loadOrder: 1,
            example: `{
  "permissions": {
    "allow": ["Read", "Edit", "Bash(git:*)"],
    "deny": ["Bash(rm -rf *)"]
  }
}`,
          },
        },
        {
          id: 'claude-global-claudemd',
          name: 'CLAUDE.md',
          type: 'file',
          details: {
            label: 'Global Memory',
            description: 'Personal instructions that apply to all your Claude Code sessions, regardless of project.',
            whatGoesHere: [
              'Your preferred coding style',
              'Common conventions you follow',
              'Personal preferences (commit style, testing approach, etc.)',
            ],
            whenLoaded: 'Always loaded first, before any project-specific context.',
            loadOrder: 2,
            example: `# My Global Claude Preferences

## Commit Style
- Use conventional commits (feat:, fix:, docs:, etc.)
- Keep commits atomic and focused

## Code Style
- Prefer functional programming patterns
- Always add JSDoc comments to public APIs
- Use early returns to reduce nesting`,
          },
        },
        {
          id: 'claude-global-agents',
          name: 'agents',
          type: 'folder',
          children: [
            {
              id: 'claude-global-agent-planner',
              name: 'planner.md',
              type: 'file',
              details: {
                label: 'Global Agent',
                description: 'A personal subagent available across all your projects.',
                whatGoesHere: [
                  'Agent name and description',
                  'Allowed tools (comma-separated, optional)',
                  'Behavioral instructions',
                ],
                whenLoaded: 'Loaded when Claude delegates to this subagent.',
                loadOrder: 3,
                example: `---
name: planner
description: Plans implementation approach before coding. Use proactively before starting complex tasks.
tools: Read, Grep, Glob
---

# Implementation Planner

Before writing any code, help the user:
1. Break down the task into steps
2. Identify potential challenges
3. Suggest the best approach`,
              },
            },
          ],
        },
        {
          id: 'claude-global-commands',
          name: 'commands',
          type: 'folder',
          children: [
            {
              id: 'claude-global-command-pr',
              name: 'pr.md',
              type: 'file',
              details: {
                label: 'Global Command',
                description: 'A personal slash command available in all projects. Invoke with /pr in Claude Code.',
                whatGoesHere: [
                  'Command instructions',
                  'Steps Claude should follow',
                  'Output format preferences',
                ],
                whenLoaded: 'User-invoked with /pr. Available globally.',
                loadOrder: 4,
                example: `# Create Pull Request

Create a well-formed pull request:

1. Summarize all changes since branching from main
2. Generate a conventional PR title
3. Write a description with:
   - Summary of changes
   - Testing done
   - Any breaking changes
4. Create the PR using gh cli`,
              },
            },
          ],
        },
        {
          id: 'claude-global-rules',
          name: 'rules',
          type: 'folder',
          children: [
            {
              id: 'claude-global-rule-security',
              name: 'security.md',
              type: 'file',
              details: {
                label: 'Global Rule',
                description: 'Personal rules that apply across all your projects.',
                whatGoesHere: [
                  'Security best practices',
                  'Personal coding standards',
                  'Common patterns to follow',
                ],
                whenLoaded: 'Always loaded with global context.',
                loadOrder: 3,
                example: `# Security Rules

- Never commit secrets or credentials
- Always validate user input
- Use parameterized queries for databases
- Sanitize output to prevent XSS`,
              },
            },
          ],
        },
        {
          id: 'claude-global-skills',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'claude-global-skill-review',
              name: 'code-review',
              type: 'folder',
              children: [
                {
                  id: 'claude-global-skill-review-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Global Skill',
                    description: 'A personal skill available across all your projects.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Review criteria and checklist',
                      'Common patterns to look for',
                    ],
                    whenLoaded: 'Auto-selected when code review tasks are detected.',
                    loadOrder: 5,
                    example: `---
name: "code-review"
description: "Thorough code review following best practices. Use when reviewing code changes, PRs, or asking for feedback on implementations."
---

# Code Review Skill

## Review Checklist
1. **Correctness** - Does it do what it's supposed to?
2. **Security** - Any vulnerabilities? Input validation?
3. **Performance** - Any obvious inefficiencies?
4. **Readability** - Clear naming? Good structure?
5. **Testing** - Adequate test coverage?

## Common Issues to Flag
- Hardcoded secrets or credentials
- Missing error handling
- N+1 query patterns
- Unused imports/variables`,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'claude-global-claudejson',
      name: '.claude.json',
      type: 'file',
      details: {
        label: 'User Config',
        description: 'Claude Code preferences, OAuth session, MCP server configs, and caches.',
        whatGoesHere: [
          'MCP server configurations',
          'OAuth/authentication state',
          'Per-project state and caches',
        ],
        whenLoaded: 'Always loaded. Manages authentication and MCP connections.',
        loadOrder: 1,
        example: `{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}`,
      },
    },
  ],
}

export const cursorTree: FileNode = {
  id: 'cursor-root',
  name: 'my-project',
  type: 'folder',
  children: [
    {
      id: 'cursor-dotcursor',
      name: '.cursor',
      type: 'folder',
      children: [
        {
          id: 'cursor-instructions',
          name: 'instructions.md',
          type: 'file',
          details: {
            label: 'Project Instructions',
            description: 'Cursor\'s primary file for project context. Automatically loaded for all AI interactions.',
            whatGoesHere: [
              'Project overview and tech stack',
              'Coding conventions (naming, formatting, patterns)',
              'Testing requirements and how to run tests',
              'Build/deploy commands',
              'Security constraints',
            ],
            whenLoaded: 'Always loaded first. Forms the baseline context for all Cursor interactions.',
            loadOrder: 1,
            example: `# Cursor Instructions

## Tech Stack
- TypeScript, React 18, Node.js 20
- PostgreSQL with Prisma ORM

## Conventions
- Use functional components with hooks
- Prefer named exports
- All API endpoints return { data, error } shape

## Testing
- Run tests: \`npm test\`
- All PRs must have tests for new functionality`,
          },
        },
        {
          id: 'cursor-mcp',
          name: 'mcp.json',
          type: 'file',
          details: {
            label: 'MCP Config',
            description: 'Model Context Protocol server configurations for tool integrations. Supports stdio, SSE, and HTTP transports.',
            whatGoesHere: [
              'MCP server definitions',
              'Command/args for stdio servers',
              'URLs for remote HTTP/SSE servers',
              'Environment variables and auth config',
            ],
            whenLoaded: 'Loaded at startup. MCP servers provide additional tools to the agent.',
            loadOrder: 0,
            example: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "\${env:GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "\${workspaceFolder}"]
    }
  }
}`,
          },
        },
        {
          id: 'cursor-hooks',
          name: 'hooks.json',
          type: 'file',
          details: {
            label: 'Lifecycle Hooks',
            description: 'Defines shell commands that run at specific lifecycle events (session start/end, before/after tool execution, etc.).',
            whatGoesHere: [
              'Hook event types (sessionStart, sessionEnd, beforeShellExecution, etc.)',
              'Commands to execute with optional timeout',
              'Validation and audit workflows',
            ],
            whenLoaded: 'Hooks execute at their defined lifecycle points during agent execution.',
            loadOrder: 0,
            example: `{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {"command": "./hooks/init.sh"}
    ],
    "beforeShellExecution": [
      {"command": "./hooks/audit.sh"}
    ],
    "afterFileEdit": [
      {"command": "./hooks/format.sh"}
    ]
  }
}`,
          },
        },
        {
          id: 'cursor-agents-folder',
          name: 'agents',
          type: 'folder',
          children: [
            {
              id: 'cursor-agent-reviewer',
              name: 'code-reviewer.md',
              type: 'file',
              details: {
                label: 'Custom Agent',
                description: 'Defines a specialized subagent with specific roles, model selection, and context isolation.',
                whatGoesHere: [
                  'Agent name and description (in frontmatter)',
                  'Model selection (fast, inherit, or specific model ID)',
                  'Readonly flag for write restrictions',
                  'Behavioral instructions in body',
                ],
                whenLoaded: 'Loaded when Cursor delegates to this subagent based on task matching.',
                loadOrder: 5,
                example: `---
name: code-reviewer
description: Expert code review specialist. Reviews code for quality, security, and maintainability.
model: fast
readonly: true
---

You are a code reviewer. When invoked:
1. Identify bugs and potential issues
2. Check adherence to project conventions
3. Suggest improvements (but don't make changes)
4. Look for security vulnerabilities`,
              },
            },
            {
              id: 'cursor-agent-planner',
              name: 'planner.md',
              type: 'file',
              details: {
                label: 'Custom Agent',
                description: 'Defines a specialized subagent with specific roles, model selection, and context isolation.',
                whatGoesHere: [
                  'Agent name and description (in frontmatter)',
                  'Model selection (fast, inherit, or specific model ID)',
                  'Background execution flag for async work',
                  'Behavioral instructions in body',
                ],
                whenLoaded: 'Loaded when Cursor delegates to this subagent based on task matching.',
                loadOrder: 5,
                example: `---
name: planner
description: Plans implementation approach before coding. Use for complex features requiring architectural decisions.
model: inherit
---

# Implementation Planner

Before writing any code, help the user:
1. Break down the task into steps
2. Identify potential challenges
3. Suggest the best approach
4. Consider edge cases and testing strategy`,
              },
            },
          ],
        },
        {
          id: 'cursor-skills-folder',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'cursor-skill-debug-ci',
              name: 'debug-ci',
              type: 'folder',
              children: [
                {
                  id: 'cursor-skill-debug-ci-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Skill',
                    description: 'A reusable, multi-step workflow that Cursor can invoke automatically based on task description.',
                    whatGoesHere: [
                      'Skill metadata (name, description in frontmatter)',
                      'When to use this skill',
                      'Step-by-step instructions',
                      'Best practices and patterns',
                    ],
                    whenLoaded: 'Auto-selected based on task. The description is matched against user requests.',
                    loadOrder: 6,
                    example: `---
name: debug-ci
description: Diagnose and fix failing CI runs. Use when continuous integration tests fail.
---

# Debug CI Failures

## When to Use
- Use when CI/CD pipeline fails
- When tests pass locally but fail in CI

## Steps
1. Check CI logs for error message
2. Identify environment differences (Node version, dependencies, etc.)
3. Reproduce locally with same environment
4. Fix and verify in CI`,
                  },
                },
              ],
            },
            {
              id: 'cursor-skill-refactor',
              name: 'refactor',
              type: 'folder',
              children: [
                {
                  id: 'cursor-skill-refactor-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Skill',
                    description: 'A reusable, multi-step workflow that Cursor can invoke automatically based on task description.',
                    whatGoesHere: [
                      'Skill metadata (name, description in frontmatter)',
                      'When to use this skill',
                      'Step-by-step instructions',
                      'Best practices and patterns',
                    ],
                    whenLoaded: 'Auto-selected based on task. The description is matched against user requests.',
                    loadOrder: 6,
                    example: `---
name: refactor
description: Refactor code while maintaining tests and functionality. Use for code cleanup and improvements.
---

# Safe Refactoring

## When to Use
- When improving code structure without changing behavior
- When code smells are detected

## Instructions
1. Run existing tests first to establish baseline
2. Make incremental changes
3. Run tests after each change
4. Commit working states
5. Update documentation if needed`,
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'cursor-commands-folder',
          name: 'commands',
          type: 'folder',
          children: [
            {
              id: 'cursor-command-commit',
              name: 'commit.md',
              type: 'file',
              details: {
                label: 'Slash Command',
                description: 'Custom slash command invoked with /commit. Parameters passed after command name are included in the prompt.',
                whatGoesHere: [
                  'Instructions for the command',
                  'Steps to follow',
                  'Output format preferences',
                  'Parameters are passed as text after command name',
                ],
                whenLoaded: 'User-invoked with /commit in Cursor chat. Not automatically loaded.',
                loadOrder: 7,
                example: `# Create Commit

Create a git commit with conventional format.

## Steps
1. Review current git status
2. Analyze staged changes
3. Generate commit message following conventional commits format
4. Create the commit

## Format
- feat: new features
- fix: bug fixes
- docs: documentation
- refactor: code refactoring`,
              },
            },
            {
              id: 'cursor-command-review-pr',
              name: 'review-pr.md',
              type: 'file',
              details: {
                label: 'Slash Command',
                description: 'Custom slash command invoked with /review-pr. Parameters passed after command name are included in the prompt.',
                whatGoesHere: [
                  'Instructions for the command',
                  'Review criteria and checklist',
                  'Output format',
                ],
                whenLoaded: 'User-invoked with /review-pr in Cursor chat. Not automatically loaded.',
                loadOrder: 7,
                example: `# Review Pull Request

Review this PR for:

## Checklist
- [ ] Logic correctness
- [ ] Error handling
- [ ] Test coverage
- [ ] Security considerations
- [ ] Performance implications
- [ ] Documentation updates`,
              },
            },
          ],
        },
        {
          id: 'cursor-rules-folder',
          name: 'rules',
          type: 'folder',
          children: [
            {
              id: 'cursor-rule-frontend',
              name: 'frontend.md',
              type: 'file',
              details: {
                label: 'Path-Specific Rule',
                description: 'Rules that apply to specific directories or file patterns.',
                whatGoesHere: [
                  'Directory-specific conventions',
                  'Framework-specific guidance',
                  'Different rules for frontend vs backend',
                ],
                whenLoaded: 'Loaded when working on files in matching paths.',
                loadOrder: 4,
                example: `# Frontend Rules

## React Conventions
- Use functional components only
- Extract reusable logic into custom hooks
- Keep components focused and small

## Testing
- Use React Testing Library
- Test behavior, not implementation
- Aim for high coverage on critical paths`,
              },
            },
            {
              id: 'cursor-rule-backend',
              name: 'backend.md',
              type: 'file',
              details: {
                label: 'Path-Specific Rule',
                description: 'Rules that apply to specific directories or file patterns.',
                whatGoesHere: [
                  'Directory-specific conventions',
                  'API design patterns',
                  'Database interaction guidelines',
                ],
                whenLoaded: 'Loaded when working on files in matching paths.',
                loadOrder: 4,
                example: `# Backend Rules

## API Conventions
- RESTful endpoint naming
- Always validate input
- Return consistent error shapes
- Use proper HTTP status codes

## Database
- Use parameterized queries
- Handle connection errors gracefully`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cursor-frontend',
      name: 'frontend',
      type: 'folder',
      children: [
        {
          id: 'cursor-frontend-instructions',
          name: '.cursor',
          type: 'folder',
          children: [
            {
              id: 'cursor-frontend-instructions-file',
              name: 'instructions.md',
              type: 'file',
              details: {
                label: 'Nested Instructions',
                description: 'Additional context for this directory. Cursor reads this when working in this area.',
                whatGoesHere: [
                  'Directory-specific stack info',
                  'Local conventions',
                  'Relevant commands',
                ],
                whenLoaded: 'Loaded when working in this directory. Adds to root context.',
                loadOrder: 2,
                example: `# Frontend Instructions

## Stack
- React 18 with TypeScript
- Vite for bundling
- TanStack Query for data fetching

## Key Directories
- \`/src/components\` — UI components
- \`/src/hooks\` — Custom hooks`,
              },
            },
          ],
        },
        {
          id: 'cursor-frontend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
    {
      id: 'cursor-backend',
      name: 'backend',
      type: 'folder',
      children: [
        {
          id: 'cursor-backend-instructions',
          name: '.cursor',
          type: 'folder',
          children: [
            {
              id: 'cursor-backend-instructions-file',
              name: 'instructions.md',
              type: 'file',
              details: {
                label: 'Nested Instructions',
                description: 'Additional context for this directory. Cursor reads this when working in this area.',
                whatGoesHere: [
                  'Directory-specific stack info',
                  'Local conventions',
                  'Relevant commands',
                ],
                whenLoaded: 'Loaded when working in this directory. Adds to root context.',
                loadOrder: 2,
                example: `# Backend Instructions

## Stack
- Node.js with Express
- PostgreSQL with Prisma

## Key Directories
- \`/src/routes\` — API routes
- \`/src/services\` — Business logic`,
              },
            },
          ],
        },
        {
          id: 'cursor-backend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
  ],
}

export const cursorGlobalTree: FileNode = {
  id: 'cursor-global-root',
  name: '~',
  type: 'folder',
  children: [
    {
      id: 'cursor-global-dotcursor',
      name: '.cursor',
      type: 'folder',
      children: [
        {
          id: 'cursor-global-mcp',
          name: 'mcp.json',
          type: 'file',
          details: {
            label: 'Global MCP Config',
            description: 'Personal MCP server configurations available across all your projects.',
            whatGoesHere: [
              'MCP servers you use frequently',
              'Personal API keys and credentials',
              'Tool integrations (GitHub, filesystem, databases, etc.)',
            ],
            whenLoaded: 'Always loaded. Available in all projects unless overridden by project-level config.',
            loadOrder: 1,
            example: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "\${env:GITHUB_TOKEN}"
      }
    }
  }
}`,
          },
        },
        {
          id: 'cursor-global-agents',
          name: 'agents',
          type: 'folder',
          children: [
            {
              id: 'cursor-global-agent-verifier',
              name: 'verifier.md',
              type: 'file',
              details: {
                label: 'Global Agent',
                description: 'A personal subagent available across all your projects.',
                whatGoesHere: [
                  'Agent name and description (in frontmatter)',
                  'Model selection (fast, inherit, specific ID)',
                  'Behavioral instructions',
                  'Personal workflows you use everywhere',
                ],
                whenLoaded: 'Available globally. Loaded when delegated to by Cursor.',
                loadOrder: 3,
                example: `---
name: verifier
description: Validates completed work after tasks are marked done. Use to confirm implementations match requirements.
model: fast
---

# Verification Agent

You are a skeptical validator verifying claimed work completion.

When invoked:
1. Identify what was claimed to be completed
2. Check implementation exists and functions properly
3. Run relevant tests or verification steps
4. Look for edge cases that might have been missed

Report findings clearly, distinguishing verified work from incomplete items.`,
              },
            },
          ],
        },
        {
          id: 'cursor-global-skills',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'cursor-global-skill-pr',
              name: 'git-pr-workflow',
              type: 'folder',
              children: [
                {
                  id: 'cursor-global-skill-pr-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Global Skill',
                    description: 'A personal skill available across all your projects. Great for workflows you use everywhere.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Step-by-step instructions',
                      'Tool usage patterns',
                      'Common workflows you repeat across repos',
                    ],
                    whenLoaded: 'Auto-selected based on task. Available globally regardless of which project you\'re in.',
                    loadOrder: 4,
                    example: `---
name: git-pr-workflow
description: Create well-formed PRs with conventional commits, proper descriptions, and linked issues. Use when creating or preparing pull requests.
---

# Git PR Workflow

## When to Use
- When preparing to create a pull request
- When reviewing PR readiness

## Before Creating PR
1. Ensure all commits follow conventional commit format
2. Rebase on latest main if needed
3. Run tests locally

## PR Description Template
- Summary of changes
- Link to related issue(s)
- Testing done
- Screenshots if UI changes

## Checklist
- [ ] Tests pass
- [ ] No console.log statements
- [ ] Documentation updated if needed`,
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'cursor-global-commands',
          name: 'commands',
          type: 'folder',
          children: [
            {
              id: 'cursor-global-command-explain',
              name: 'explain.md',
              type: 'file',
              details: {
                label: 'Global Command',
                description: 'A personal slash command available in all projects. Invoke with /explain in Cursor.',
                whatGoesHere: [
                  'Command instructions',
                  'Steps to follow',
                  'Output format preferences',
                ],
                whenLoaded: 'User-invoked with /explain. Available globally across all projects.',
                loadOrder: 5,
                example: `# Explain Code

Provide a clear explanation of the selected code:

## What to Cover
1. What does this code do? (high-level purpose)
2. How does it work? (step-by-step breakdown)
3. Why is it implemented this way? (design decisions)
4. Any potential issues or improvements?

## Format
- Use clear, simple language
- Include examples where helpful
- Highlight any non-obvious behavior`,
              },
            },
          ],
        },
      ],
    },
  ],
}

export const codexTree: FileNode = {
  id: 'codex-root',
  name: 'my-project',
  type: 'folder',
  children: [
    {
      id: 'codex-dotcodex',
      name: '.codex',
      type: 'folder',
      children: [
        {
          id: 'codex-skills-folder',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'codex-skill-debug-ci',
              name: 'debug-ci',
              type: 'folder',
              children: [
                {
                  id: 'codex-skill-debug-ci-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Skill',
                    description: 'A reusable, multi-step workflow that Codex can invoke automatically based on task description.',
                    whatGoesHere: [
                      'Skill metadata (name, description in frontmatter)',
                      'When to use this skill',
                      'Step-by-step instructions',
                      'Best practices and patterns',
                    ],
                    whenLoaded: 'Auto-selected based on task. The description is matched against user requests.',
                    loadOrder: 6,
                    example: `---
name: debug-ci
description: Diagnose and fix failing CI runs. Use when continuous integration tests fail.
---

# Debug CI Failures

## When to Use
- Use when CI/CD pipeline fails
- When tests pass locally but fail in CI

## Steps
1. Check CI logs for error message
2. Identify environment differences
3. Reproduce locally with same environment
4. Fix and verify in CI`,
                  },
                },
              ],
            },
            {
              id: 'codex-skill-refactor',
              name: 'refactor',
              type: 'folder',
              children: [
                {
                  id: 'codex-skill-refactor-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Skill',
                    description: 'A reusable workflow for safe code refactoring.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Refactoring guidelines',
                      'Test-driven approach',
                    ],
                    whenLoaded: 'Auto-selected when refactoring tasks are detected.',
                    loadOrder: 6,
                    example: `---
name: refactor
description: Refactor code while maintaining tests and functionality.
---

# Safe Refactoring

## Instructions
1. Run existing tests first
2. Make incremental changes
3. Run tests after each change
4. Commit working states`,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'codex-agents-md',
      name: 'AGENTS.md',
      type: 'file',
      details: {
        label: 'Project Instructions',
        description: 'Codex\'s primary file for project context. Supports hierarchical loading from parent directories.',
        whatGoesHere: [
          'Project overview and tech stack',
          'Build and test commands',
          'Coding conventions',
          'Project structure notes',
        ],
        whenLoaded: 'Always loaded first. Codex walks from project root to current directory, merging AGENTS.md files.',
        loadOrder: 1,
        example: `# AGENTS.md

## Tech Stack
- TypeScript, React 18, Node.js 20
- PostgreSQL with Prisma ORM

## Commands
- Build: \`npm run build\`
- Test: \`npm test\`
- Lint: \`npm run lint\`

## Conventions
- Use functional components
- Prefer named exports
- Run tests before committing`,
      },
    },
    {
      id: 'codex-frontend',
      name: 'frontend',
      type: 'folder',
      children: [
        {
          id: 'codex-frontend-agents',
          name: 'AGENTS.md',
          type: 'file',
          details: {
            label: 'Nested Instructions',
            description: 'Path-scoped instructions that apply to this directory. Merged with parent AGENTS.md files.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Appended to parent context (closer files override).',
            loadOrder: 2,
            example: `# Frontend AGENTS.md

## Stack
- React 18 with TypeScript
- Vite for bundling

## Patterns
- Components in /components
- Hooks in /hooks
- Use React Testing Library`,
          },
        },
        {
          id: 'codex-frontend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
    {
      id: 'codex-backend',
      name: 'backend',
      type: 'folder',
      children: [
        {
          id: 'codex-backend-agents',
          name: 'AGENTS.md',
          type: 'file',
          details: {
            label: 'Nested Instructions',
            description: 'Path-scoped instructions that apply to this directory. Merged with parent AGENTS.md files.',
            whatGoesHere: [
              'Directory-specific stack info',
              'API conventions',
              'Database patterns',
            ],
            whenLoaded: 'Loaded when working in this directory. Appended to parent context (closer files override).',
            loadOrder: 2,
            example: `# Backend AGENTS.md

## Stack
- Node.js with Express
- PostgreSQL with Prisma

## Conventions
- RESTful endpoint naming
- Always validate input
- Use parameterized queries`,
          },
        },
        {
          id: 'codex-backend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
  ],
}

export const codexGlobalTree: FileNode = {
  id: 'codex-global-root',
  name: '~',
  type: 'folder',
  children: [
    {
      id: 'codex-global-dotcodex',
      name: '.codex',
      type: 'folder',
      children: [
        {
          id: 'codex-global-config',
          name: 'config.toml',
          type: 'file',
          details: {
            label: 'Global Config',
            description: 'Personal Codex settings that apply across all projects. Shared between CLI and IDE extension.',
            whatGoesHere: [
              'Default model preferences',
              'Approval policies (untrusted, on-request, never)',
              'Sandbox mode settings',
              'MCP server configurations',
              'Shell environment policies',
            ],
            whenLoaded: 'Always loaded. Merged with project-level config (CLI flags take precedence).',
            loadOrder: 1,
            example: `# ~/.codex/config.toml

model = "gpt-5.2"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[mcp_servers.github]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]

[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]`,
          },
        },
        {
          id: 'codex-global-agents-md',
          name: 'AGENTS.md',
          type: 'file',
          details: {
            label: 'Instructions (User-Level)',
            description: 'Personal instructions that apply to all your Codex sessions, regardless of project.',
            whatGoesHere: [
              'Your preferred coding style',
              'Common conventions you follow',
              'Personal preferences (commit style, testing approach)',
            ],
            whenLoaded: 'Always loaded first, before any project-specific context.',
            loadOrder: 2,
            example: `# My Global Codex Preferences

## Commit Style
- Use conventional commits (feat:, fix:, docs:)
- Keep commits atomic and focused

## Code Style
- Prefer functional programming patterns
- Always add JSDoc comments to public APIs
- Use early returns to reduce nesting`,
          },
        },
        {
          id: 'codex-global-rules',
          name: 'rules',
          type: 'folder',
          children: [
            {
              id: 'codex-global-rules-default',
              name: 'default.rules',
              type: 'file',
              details: {
                label: 'Command Rules',
                description: 'Starlark rules that control which commands Codex can run outside the sandbox.',
                whatGoesHere: [
                  'prefix_rule() definitions with patterns',
                  'Allow/prompt/forbidden decisions',
                  'Justifications for security rules',
                ],
                whenLoaded: 'Loaded at startup. Applied before command execution.',
                loadOrder: 0,
                example: `# ~/.codex/rules/default.rules

# Allow git commands
prefix_rule(
  pattern=["git"],
  decision="allow"
)

# Prompt before npm publish
prefix_rule(
  pattern=["npm", "publish"],
  decision="prompt",
  justification="Publishing requires confirmation"
)

# Block dangerous commands
prefix_rule(
  pattern=["rm", "-rf", "/"],
  decision="forbidden",
  justification="Prevents accidental system damage"
)`,
              },
            },
          ],
        },
        {
          id: 'codex-global-skills',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'codex-global-skill-pr',
              name: 'git-pr-workflow',
              type: 'folder',
              children: [
                {
                  id: 'codex-global-skill-pr-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Global Skill',
                    description: 'A personal skill available across all your projects.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Step-by-step instructions',
                      'Common workflows you repeat across repos',
                    ],
                    whenLoaded: 'Auto-selected based on task. Available globally.',
                    loadOrder: 4,
                    example: `---
name: git-pr-workflow
description: Create well-formed PRs with conventional commits and proper descriptions.
---

# Git PR Workflow

## Before Creating PR
1. Ensure commits follow conventional format
2. Rebase on latest main if needed
3. Run tests locally

## PR Description
- Summary of changes
- Link to related issue(s)
- Testing done`,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const trees: Record<Provider, FileNode> = {
  copilot: copilotTree,
  claude: claudeTree,
  cursor: cursorTree,
  codex: codexTree,
}

export const globalTrees: Record<Provider, FileNode> = {
  copilot: copilotGlobalTree,
  claude: claudeGlobalTree,
  cursor: cursorGlobalTree,
  codex: codexGlobalTree,
}
