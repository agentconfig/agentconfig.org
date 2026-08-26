---
name: add-primitive
description: Add or modify AI primitive definitions in the data layer with correct typing and complete metadata. Use when adding new primitives, updating descriptions, or extending primitive categories.
---

# Add Primitive

Add or modify AI primitive definitions for agentconfig.org.

## Overview

Primitives appear in these places:
1. **Primitive Cards** - `site/src/data/primitives.ts` (the single canonical source)
2. **File Tree** - `site/src/data/fileTree.ts`
3. **Provider Comparison** - `site/src/data/comparison.ts` (derived automatically from `primitives.ts`; never hand-edited)
4. **Provider Profiles** - `site/src/data/providerProfiles.ts` (also derived automatically from `primitives.ts`; never hand-edited)

## Step-by-Step Process

### 1. Define the Primitive

Edit `site/src/data/primitives.ts`:

```typescript
{
  id: 'your-primitive-id',           // lowercase, hyphens
  name: 'Display Name',
  description: 'One-sentence summary.',
  whatItIs: 'Detailed explanation of the concept.',
  useWhen: [
    'First use case',
    'Second use case',
  ],
  prevents: 'What problem/failure this prevents',
  combineWith: ['Other Primitive', 'Another Primitive'],
  implementations: [
    {
      provider: 'copilot',
      implementation: 'How Copilot implements this',
      location: '.github/path/to/file',
      support: 'full',  // 'full' | 'partial' | 'diy'
      sourceUrl: 'https://docs.github.com/...',  // primary provider documentation
    },
    {
      provider: 'claude',
      implementation: 'How Claude implements this',
      location: '.claude/path/to/file',
      support: 'full',
      sourceUrl: 'https://code.claude.com/docs/...',
    },
    {
      provider: 'cursor',
      implementation: 'How Cursor implements this',
      location: '.cursor/path/to/file',
      support: 'full',
      sourceUrl: 'https://cursor.com/docs/...',
    },
    {
      provider: 'codex',
      implementation: 'How Codex implements this',
      location: '~/.codex/path/to/file',
      support: 'full',
      sourceUrl: 'https://developers.openai.com/codex/...',
    },
  ],
  category: 'instructions',  // one of the 8 layer ids — see Categories below
}
```

Always list all four providers (`copilot`, `claude`, `cursor`, `codex`) even when support is `partial` or `diy` — a missing provider entry silently reads as "no data" rather than "not supported," which the `refresh-provider-docs` skill and comparison table both rely on to stay honest. Cite a primary `sourceUrl` for every claim; do not add a primitive with unverified provider claims (use the `refresh-provider-docs` skill first if you have not already confirmed the paths against current documentation).

### 2. Add to File Tree (if applicable)

If the primitive has associated files, add nodes to both trees in `site/src/data/fileTree.ts`:

**For Copilot** - Add to `copilotTree`:
```typescript
{
  id: 'copilot-your-primitive',
  name: 'your-file.md',
  type: 'file',
  details: {
    label: 'Short Label',
    description: 'What this file does.',
    whatGoesHere: ['Content item 1', 'Content item 2'],
    whenLoaded: 'When this file is loaded.',
    loadOrder: 5,  // 1 = first loaded
    example: `Example content here`,
  },
}
```

**For Claude, Cursor, and Codex** - Add to the corresponding tree (`claudeTree`, `cursorTree`, `codexTree`) with equivalent structure.

### 3. Comparison Matrix and Provider Profiles need no separate edit

`site/src/data/comparison.ts` and `site/src/data/providerProfiles.ts` both compute their rows from `primitives.ts` at import time (`comparisonData` maps every entry in the `primitives` array). Once step 1 adds all four provider implementations to `primitives.ts`, the comparison matrix and provider profiles pick up the new primitive automatically. Do not hand-edit either file — doing so would duplicate the same fact in two places and reintroduce the drift this derivation was built to eliminate (see PR #42's review history for the class of bug this prevents).

### 4. Add scope metadata, not a new primitive, when the concept is "where this applies"

If what you're adding describes *where* a primitive applies (user vs. repository vs. directory vs. session, etc.) rather than a new independent capability, it belongs in `scopeModel` in `primitives.ts`, not as a new peer primitive. Scopes are not primitives — see the Scope Model section on the homepage for the existing nine-scope vocabulary before inventing a new one.

## Data Types Reference

### Primitive Interface
```typescript
interface Primitive {
  id: string
  name: string
  description: string
  whatItIs: string
  useWhen: string[]
  prevents: string
  combineWith: string[]
  implementations: ProviderImplementation[]
  category: LayerId
}
```

### Provider Implementation
```typescript
interface ProviderImplementation {
  provider: 'copilot' | 'claude' | 'cursor' | 'codex'
  implementation: string
  location: string
  support: 'full' | 'partial' | 'diy'
  sourceUrl?: string  // primary provider documentation backing this claim
}
```

### Support Levels

`primitives.ts` (`ProviderImplementation.support`) uses one shared enum: `'full' | 'partial' | 'diy'`:

- `full` - Native, well-documented support
- `partial` - Works but with limitations
- `diy` - No built-in support; requires custom setup to approximate

`comparison.ts`'s `SupportLevel` type is now a type alias for this same enum (`ComparisonRow[provider].level` derives directly from `ProviderImplementation.support`), so a row with `diy` in `primitives.ts` also shows `diy` in the comparison table — there is no separate `none` value to translate to.

### Categories (Layers)

The taxonomy groups primitives into eight layers (`LayerId` in `site/src/data/primitives.ts`), each representing a different concern in an agent's configuration:

- `instructions` - Standing guidance loaded into context (e.g. AGENTS.md)
- `procedures` - Repeatable, invokable workflows (e.g. slash commands, skills)
- `tools-context` - External tools and data sources (e.g. MCP)
- `delegation` - Handing off work to another agent persona (e.g. custom agents)
- `control-approval` - Constraints on what the agent may do (e.g. guardrails, hooks, sandboxing)
- `memory-state` - Durable state carried across sessions (reserved; not yet backed by a primitive — see the CCR note on `global-instructions` before adding one)
- `distribution` - How shared configuration is packaged and discovered across scopes
- `verification-observability` - Checks that validate output before it ships

Do not reuse the retired `execution`/`safety` category names; every primitive's `category` field must be one of the eight ids above, and `site/src/data/primitives.ts`'s `categories` array is the source of truth for display names and ordering.

## Checklist

Before considering the primitive complete:

- [ ] Added to `primitives.ts` with all required fields, all four providers, and a `sourceUrl` per implementation
- [ ] Added to `fileTree.ts` for each provider with associated files
- [ ] `id` is unique and matches across `primitives.ts` and `fileTree.ts`
- [ ] `combineWith` references valid primitive names
- [ ] Examples in file tree are accurate and helpful
- [ ] Run `bun run typecheck` - No TypeScript errors
- [ ] Visually verify the primitive on the Primitive Cards, Provider Comparison, and Provider Profiles sections (the latter two derive automatically from `primitives.ts` — verifying them confirms the derivation picked up the new row, not that you need to edit them)

## Common Mistakes

1. **Hand-editing `comparison.ts` or `providerProfiles.ts`** - Both derive from `primitives.ts`; edit only `primitives.ts` and the derived views update automatically
2. **Missing file tree entries** - If the primitive has files, both trees need updates
3. **Stale combineWith** - Referencing primitives that don't exist
4. **Incorrect load order** - File tree `loadOrder` should reflect actual precedence
5. **Missing support level** - Every provider implementation needs a support level
