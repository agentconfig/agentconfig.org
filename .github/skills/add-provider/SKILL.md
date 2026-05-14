---
name: add-provider
description: Implement a new AI provider across agentconfig.org's comparison system (Streams 1-6). Use after research is complete. Handles type system updates, implementation data, UI components, tests, and documentation.
model: opus
---

# Add Provider (Implementation)

Implement a new AI provider across agentconfig.org's 6 work streams.

This skill handles the **execution phase** after research is complete. Use `research-provider` skill first to gather capability audit data.

## When to Use

Use this skill when:
- Research is complete (use `research-provider` skill first)
- You have provider capability audit and config file locations documented
- You're ready to implement across all 6 work streams
- You have verified support levels for all 11 primitives

## Prerequisites

Before starting, you need:
- **Provider capability audit** - Which of the 11 primitives does the provider support?
- **File path documentation** - Where do config files go (global vs project)?
- **Support levels** - `full` (native), `partial` (workarounds), `none` (unavailable), `diy` (custom setup)
- **References** - Links to official documentation for each primitive

## The 11 Primitives

Every provider must be implemented across these primitives:

| Category | Primitives |
|----------|-----------|
| **Execution** | Agent Mode, Skills/Workflows, Tool Integrations (MCP) |
| **Customization** | Persistent Instructions, Global Instructions, Path-Scoped Rules, Slash Commands |
| **Control** | Custom Agents, Permissions & Guardrails, Lifecycle Hooks, Verification/Evals |

## Quick Start

1. **📋 Read the detailed implementation process** → See [PROCESS.md](references/PROCESS.md) for step-by-step instructions for all 6 streams

2. **📖 Review code examples** → See [EXAMPLES.md](references/EXAMPLES.md) for copy-paste templates for each stream

3. **🎨 Understand patterns** → See [PATTERNS.md](references/PATTERNS.md) for support levels and naming conventions

4. **🐛 Handle errors** → See [ERRORS.md](references/ERRORS.md) for solutions to common issues (including critical generation script updates)

5. **✅ Verify completion** → See [CHECKLIST.md](references/CHECKLIST.md) for post-implementation verification steps

## 6-Stream Implementation Workflow

```
Stream 1: Type System (Add provider to union types)
   ↓
Stream 2: Data Layer (Add implementations for all 11 primitives)
   ├→ Stream 3: UI Components (Update comparison table)
   │    ↓
   │  Stream 4: Testing (Update E2E tests)
   │    ↓
   └→ Stream 5: App Integration (Update site copy/docs) [can run in parallel with 3-4]
        ↓
      Stream 6: LLMs Generation (Regenerate machine-readable files)
```

**Execution strategy**: Streams 1-2 are sequential. Streams 3-5 can run in parallel. Stream 6 must complete last. Use your research audit data to populate all implementation details.

## Key Files to Modify

| Stream | Files |
|--------|-------|
| 1 | `site/src/data/primitives.ts`, `site/src/data/fileTree.ts`, `site/src/data/comparison.ts`, `site/src/components/PrimitiveCards/PrimitiveCard.tsx` |
| 2 | `site/src/data/primitives.ts`, `site/src/data/comparison.ts`, `site/src/data/fileTree.ts` |
| 3 | `site/src/components/ProviderComparison/ComparisonTable.tsx` |
| 4 | `site/tests/e2e/comparison.spec.ts` |
| 5 | `site/src/App.tsx`, `site/src/components/Hero/Hero.tsx`, `README.md` |
| 6 | `.github/skills/generate-llms/scripts/generate-llms-full.ts` (if needed), `site/public/llms-full.txt` |

## Example Prompts

**Implement a provider after research is complete:**
```
Use the add-provider skill to implement Claude Desktop as a provider across all 6 streams.
Here's my research audit: [paste RESEARCH-GUIDE.md findings]
```

**Execute a specific stream:**
```
I have the research data for Zed AI. Now implement Stream 1 (type system) only.
```

**Continue implementation from where you left off:**
```
I've completed Streams 1-2 (types and data). Now execute Streams 3-6 (UI, tests, integration, and generation).
```

## Success Metrics

✅ Provider added to all type definitions
✅ All 11 primitives have provider implementation data
✅ Comparison table renders with provider column
✅ All E2E tests pass
✅ No TypeScript errors
✅ Production build succeeds
✅ llms-full.txt includes provider data
✅ Responsive design works
✅ Dark mode works

## PR Description Best Practices

When opening your pull request, keep it crisp and focused:

**What to include:**
- **Summary**: One sentence—what provider, what changed
- **Changes**: Organized by stream (Types, Data, UI, Tests, Integration, Docs)
- **Result**: Quick summary of provider's final support coverage
- **Testing**: Concrete steps to verify (run commands, visit site, click features)
- **References**: Link to official provider documentation as sources

**What to avoid:**
- Listing all 11 primitives exhaustively
- Repetitive narrative about each stream
- Verbose technical implementation details

**Example**: See [Cursor provider PR](https://github.com/jonmagic/agentconfig.org/pull/3) for a reference implementation.

## Related Skills

- **[research-provider](../../research-provider)** - Research a provider's capabilities (start here first)
- **[add-primitive](../../add-primitive)** - Add a new AI primitive (expand beyond 11)
- **[generate-llms](../../generate-llms)** - Regenerate llms.txt files
- **[semantic-commit](../../semantic-commit)** - Create semantic commit messages

## References

For detailed information, see:

- **[RESEARCH-GUIDE.md](references/RESEARCH-GUIDE.md)** - How to research a provider before implementation (capability audit template, decision tree, examples)
- **[PROCESS.md](references/PROCESS.md)** - Complete step-by-step instructions for all 6 streams
- **[EXAMPLES.md](references/EXAMPLES.md)** - Copy-paste code examples for each stream
- **[PATTERNS.md](references/PATTERNS.md)** - Support levels, file locations, naming conventions
- **[ERRORS.md](references/ERRORS.md)** - Common issues and solutions (including critical generation script updates)
- **[CHECKLIST.md](references/CHECKLIST.md)** - Comprehensive verification checklists (includes pre-implementation checklist)
