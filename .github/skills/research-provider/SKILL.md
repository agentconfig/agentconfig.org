---
name: research-provider
description: Research a new AI provider's capabilities across all 11 primitives. Gather documentation, audit support levels, and prepare capability audit for implementation. Use before add-provider skill.
model: haiku
---

# Research Provider

Research a new AI coding assistant provider to gather all information needed for implementation.

This skill executes the **research phase**—efficiently auditing provider capabilities across all 11 AI primitives. Complete this first, then use the `add-provider` skill to implement across 6 work streams.

## Your Research Output

You'll produce a capability audit table documenting:

- Each of the 11 AI primitives and support level (full/partial/diy/none)
- Config file locations (project-level and global)
- Official documentation links as evidence
- Key findings and limitations

This audit becomes the input for the `add-provider` implementation skill.

## Research Steps

1. **Visit official documentation** - Read provider's official docs, config guides, examples
2. **Map each primitive** - For each of the 11 primitives:
   - Decide support level using the decision tree (see `support-levels.md`)
   - Find config file location(s)
   - Collect evidence link(s) from official docs
3. **Document findings** - Use the format guide to structure your audit
4. **Verify accuracy** - Check your support level decisions match the decision tree

## The 11 Primitives

**Execution**: Agent Mode, Skills/Workflows, Tool Integrations (MCP)
**Customization**: Persistent Instructions, Global Instructions, Path-Scoped Rules, Slash Commands
**Control**: Custom Agents, Permissions & Guardrails, Lifecycle Hooks, Verification/Evals

## Example Prompts

**Research a new provider:**
```
Use research-provider to audit [Provider Name]'s support for all 11 AI primitives.
Document support levels, config locations, and verify against official documentation.
```

**Update existing research:**
```
Update your research for [Provider Name]. Have they added support for [Primitive]?
Check official docs and verify against current implementation.
```

## Guidance Documents

- **[support-levels.md](references/support-levels.md)** - Definitions and decision tree for assigning support levels
- **[format-guide.md](references/format-guide.md)** - How to structure your audit output (template + examples)
- **[example-audit.md](references/example-audit.md)** - Complete example research audit (Claude Desktop)

Also reference the original **[RESEARCH-GUIDE.md](../add-provider/references/RESEARCH-GUIDE.md)** from add-provider for additional methodology details.

## Related Skills

- **[add-provider](../../add-provider)** - Implement provider after research is complete
- **[add-primitive](../../add-primitive)** - Add new AI primitive beyond the current 11
- **[semantic-commit](../../semantic-commit)** - Create semantic commit messages
