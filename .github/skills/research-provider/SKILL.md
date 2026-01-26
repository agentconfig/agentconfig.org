---
name: research-provider
description: Research a new AI provider's capabilities across all 11 primitives. Gather documentation, audit support levels, and prepare capability audit for implementation. Use before add-provider skill.
model: haiku
---

# Research Provider

Thoroughly research a new AI coding assistant provider before implementation.

This skill handles the **research phase** to gather all information needed for implementation. Complete this first, then use the `add-provider` skill to implement across all 6 streams.

## When to Use

Use this skill when:
- You want to add a new provider to agentconfig.org
- You haven't yet researched the provider's capabilities
- You want a lightweight, efficient research phase before implementation
- You're gathering documentation for an audit

## What This Skill Does

This skill will:

1. **Audit official documentation** - Visit provider docs and gather configuration file locations
2. **Map primitives** - Document support level for each of the 11 AI primitives
3. **Verify config paths** - Confirm where config files go (project-level and global)
4. **Document evidence** - Collect links and examples from official sources
5. **Create capability audit** - Produce a structured summary ready for implementation

## The 11 Primitives to Research

| Category | Primitives |
|----------|-----------|
| **Execution** | Agent Mode, Skills/Workflows, Tool Integrations (MCP) |
| **Customization** | Persistent Instructions, Global Instructions, Path-Scoped Rules, Slash Commands |
| **Control** | Custom Agents, Permissions & Guardrails, Lifecycle Hooks, Verification/Evals |

## Quick Start

1. **📖 Read the research guide** → See [RESEARCH-GUIDE.md](../add-provider/references/RESEARCH-GUIDE.md) for complete methodology
   - Capability audit template
   - Primitive support decision tree
   - Documentation checklist

2. **✅ Use the pre-implementation checklist** → See [CHECKLIST.md](../add-provider/references/CHECKLIST.md) for verification steps

3. **📋 Document your findings** → Create a structured audit table with support levels and evidence links

## Research Output

Your research will produce:

```markdown
Provider: [Name]
Research completed: [Date]

## Capability Audit

| Primitive | Support Level | Config Location | Evidence |
|-----------|---|---|---|
| Agent Mode | full/partial/diy/none | ~/.provider/config.toml | [link] |
| Skills/Workflows | full/partial/diy/none | .agent/skills.md | [link] |
| ... | ... | ... | ... |

## Summary

- Total support levels: X full, Y partial, Z diy, A none
- Config locations verified: Yes/No
- All evidence linked: Yes/No
- Ready for implementation: Yes/No

## Key Findings

[Notable features, limitations, or requirements]

## References

- [Official docs](link)
- [Config examples](link)
- [GitHub repo](link)
```

## Support Level Definitions

- **`full`** - Natively supported, documented, core feature
- **`partial`** - Works with limitations or requires workarounds
- **`diy`** - Possible but requires custom setup
- **`none`** - Not possible

## Example Prompts

**Research a new provider:**
```
Use research-provider to audit Cursor's support for all 11 AI primitives.
Focus on documentation, config file locations, and support levels.
```

**Update research for existing provider:**
```
Update my research for GitHub Copilot. Have they added support for custom agents?
Check the official documentation and verify against current implementation.
```

**Verify research findings:**
```
I've researched Claude Desktop. Here's my audit:
[paste findings]

Does this look accurate based on official documentation?
```

## Next Steps

Once research is complete:

1. Review your capability audit for accuracy
2. Verify all support levels have documentation links
3. Pass audit findings to the `add-provider` skill
4. Implement across all 6 work streams

## Related Skills

- **[add-provider](../../add-provider)** - Implement provider (use after research is complete)
- **[add-primitive](../../add-primitive)** - Add a new AI primitive (expand beyond 11)
- **[semantic-commit](../../semantic-commit)** - Create semantic commit messages

## References

For detailed research guidance, see:

- **[RESEARCH-GUIDE.md](../add-provider/references/RESEARCH-GUIDE.md)** - Complete research methodology, templates, and decision tree
- **[CHECKLIST.md](../add-provider/references/CHECKLIST.md)** - Pre-implementation verification steps
- **[PATTERNS.md](../add-provider/references/PATTERNS.md)** - Support level naming conventions and patterns
