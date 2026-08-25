---
name: add-primitive
description: Add or modify AI primitive definitions in the data layer with correct typing and complete metadata. Use when adding new primitives, updating descriptions, or extending primitive categories.
---

# Add Primitive

Add or modify AI primitive definitions for agentconfig.org.

## Overview

Primitives appear in three places that must stay synchronized:
1. **Primitive Cards** - `site/src/data/primitives.ts`
2. **File Tree** - `site/src/data/fileTree.ts`
3. **Provider Comparison** - `site/src/data/comparison.ts`

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

### 3. Add to Comparison Matrix

Edit `site/src/data/comparison.ts`. Every row needs all four providers:

```typescript
{
  primitiveId: 'your-primitive-id',  // Must match primitives.ts
  primitiveName: 'Display Name',
  copilot: {
    level: 'full',  // 'full' | 'partial' | 'none'
    implementation: 'How Copilot does it',
    location: '.github/path',
    sourceUrl: 'https://docs.github.com/...',
  },
  claude: {
    level: 'full',
    implementation: 'How Claude does it',
    location: '.claude/path',
    sourceUrl: 'https://code.claude.com/docs/...',
  },
  cursor: {
    level: 'full',
    implementation: 'How Cursor does it',
    location: '.cursor/path',
    sourceUrl: 'https://cursor.com/docs/...',
  },
  codex: {
    level: 'full',
    implementation: 'How Codex does it',
    location: '~/.codex/path',
    sourceUrl: 'https://developers.openai.com/codex/...',
  },
}
```

Keep `implementation`, `location`, and `support`/`level` text identical (word-for-word) between `primitives.ts` and `comparison.ts` for the same provider and primitive. The `refresh-provider-docs` compare tool treats any mismatch between the two files as a self-contradiction and reports it `ambiguous` rather than letting a stale duplicate slip through.

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

`primitives.ts` (`ProviderImplementation.support`) and `comparison.ts` (`ComparisonRow[provider].level`) use two different, non-interchangeable enums — do not copy one file's values into the other:

- `primitives.ts` uses `'full' | 'partial' | 'diy'`:
  - `full` - Native, well-documented support
  - `partial` - Works but with limitations
  - `diy` - No built-in support; requires custom setup to approximate
- `comparison.ts` uses `'full' | 'partial' | 'none'`:
  - `full` - Native, well-documented support
  - `partial` - Works but with limitations
  - `none` - Not supported; documentation states the capability is unavailable

If you're documenting a provider that genuinely has zero support for a primitive, use `diy` in `primitives.ts` and `none` in `comparison.ts` for the same row — this is expected, not a self-contradiction.

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
- [ ] Added to `comparison.ts` with accurate support levels, matching wording, and a `sourceUrl` per provider
- [ ] `id` is unique and matches across all three files
- [ ] `combineWith` references valid primitive names
- [ ] Examples in file tree are accurate and helpful
- [ ] Run `bun run typecheck` - No TypeScript errors
- [ ] Visually verify in all three site sections

## Common Mistakes

1. **Mismatched IDs** - The `id` in primitives.ts must match `primitiveId` in comparison.ts
2. **Missing file tree entries** - If the primitive has files, both trees need updates
3. **Stale combineWith** - Referencing primitives that don't exist
4. **Incorrect load order** - File tree `loadOrder` should reflect actual precedence
5. **Missing support level** - Every provider implementation needs a support level
