# AI Primitives Guide - Agent Context

This file provides cross-tool context for AI agents (works with both GitHub Copilot and Claude Code).

## What This Project Is

A single-page educational website (agentconfig.org) that explains AI primitives - the configuration files and patterns developers use to customize AI coding assistants like GitHub Copilot and Claude Code.

## Target Audience

Developers who want to:
- Understand what AI primitive files exist (CLAUDE.md, copilot-instructions.md, etc.)
- Know where to place these files in their projects
- Learn which primitives to use for different tasks

## The Four Visualizations

The site presents the same information in 4 different ways:

1. **Interactive File Tree** - Shows file locations visually. Click a file to see details.
2. **Primitive Cards** - Concept-first view of the 11 core primitives
3. **Work Type Recipes** - Task-oriented: "What are you trying to do?" → recommended primitives
4. **Provider Matrix** - Side-by-side Copilot vs Claude comparison

## Tech Decisions (Already Made)

- Bun + Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Playwright for testing
- GitHub Pages for hosting
- Light/dark theme support

## Quality Standards

Every change must pass:
1. `bun run lint` - ESLint
2. `bun run typecheck` - TypeScript strict mode
3. `bun run test` - Playwright E2E tests

## Commit Discipline

- Semantic commits only: `type(scope): description`
- Atomic commits - one logical change
- Minimal files per commit
- No "WIP" or vague messages

## Content Source

The `/research` folder contains extensive documentation about AI primitives. Key files:
- `05-ai-primitives-realistic-project-trees.md` - Primary source for file tree visualization
- `03-ai-primitives-playbook-and-provider-mapping.md` - Source for primitives and recipes

## Design Aesthetic

- **Light mode**: Off-white/tan backgrounds, warm friendly colors
- **Dark mode**: Dark with subtle neon accents
- Rounded corners, good whitespace, mobile-first responsive
