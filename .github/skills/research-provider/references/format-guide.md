# Capability Audit Format Guide

This guide shows the exact format and structure for documenting your research findings.

## Audit Output Template

Use this structure to organize your research results:

```markdown
# Provider Research: [Provider Name]

**Research completed**: [Date]
**Researcher**: [Name/Agent ID]
**Confidence level**: [High/Medium/Low]

## Summary

[1-2 sentence overview of provider's AI primitive support]

Example:
"Cursor is a VS Code fork with comprehensive support for AI customization. Supports 9 out of 11 primitives natively, with partial support for agent control features."

## Capability Audit

| Primitive | Support Level | Config Location | Evidence |
|-----------|---|---|---|
| Agent Mode | full/partial/diy/none | ~/.provider/config.toml | [link to docs] |
| Skills/Workflows | full/partial/diy/none | .cursor/skills.md | [link to docs] |
| Tool Integrations | full/partial/diy/none | ~/.provider/config.toml | [link to docs] |
| Persistent Instructions | full/partial/diy/none | .cursor/rules | [link to docs] |
| Global Instructions | full/partial/diy/none | ~/.cursor/config.toml | [link to docs] |
| Path-Scoped Rules | full/partial/diy/none | .cursor/.cursorignore | [link to docs] |
| Slash Commands | full/partial/diy/none | .cursor/commands/ | [link to docs] |
| Custom Agents | full/partial/diy/none | .cursor/agents/ | [link to docs] |
| Permissions & Guardrails | full/partial/diy/none | .cursor/guardrails | [link to docs] |
| Lifecycle Hooks | full/partial/diy/none | N/A (not supported) | [link to docs] |
| Verification/Evals | full/partial/diy/none | N/A (not supported) | [link to docs] |

## Key Findings

### What Works Well
- [Feature 1]: [Brief explanation and why it matters]
- [Feature 2]: [Brief explanation and why it matters]

Example:
- **Agent Mode**: Native support with documented CLI interface, can run multi-step sequences
- **Tool Integrations**: Full MCP support with good documentation

### Limitations & Caveats
- [Limitation 1]: [How it impacts implementation]
- [Limitation 2]: [How it impacts implementation]

Example:
- **Custom Agents**: Limited to provider's built-in agent types, can't define completely custom agents
- **Lifecycle Hooks**: Not mentioned in official documentation, appears unsupported

### Config File Locations

**Project-level configuration:**
- Location: `.cursor/` directory
- Files: `rules`, `commands/`, `agents/`, `config.toml`
- How accessed: Per-project, git-tracked

**Global/User-level configuration:**
- Location: `~/.cursor/` or `~/Library/Application Support/Cursor/`
- Files: `config.toml`, `settings.json`
- How accessed: User home directory, applies to all projects

## Evidence & References

**Official Documentation:**
- [Provider main docs](https://example.com/docs)
- [Provider config guide](https://example.com/docs/config)
- [Provider API reference](https://example.com/api)

**Community Resources:**
- [GitHub discussions](https://github.com/example/discussions)
- [Official examples](https://github.com/example/examples)
- [Blog post about feature X](https://example.com/blog/feature-x)

**Testing Verified:**
- ✓ Created config file at [location] and verified it loads
- ✓ Tested [feature] with [test case] and confirmed [result]
- ✓ Checked [specific limitation] and found [behavior]

## Support Level Breakdown

**Full (X primitives)**
- List the full-support primitives here

**Partial (X primitives)**
- List the partial-support primitives here
- Note: Cursor's Tool Integrations work but are limited compared to others

**DIY (X primitives)**
- List the DIY-support primitives here

**None (X primitives)**
- List the unsupported primitives here

## Ready for Implementation?

- [ ] All 11 primitives researched
- [ ] Config locations verified against official docs
- [ ] Support levels have evidence links
- [ ] Tested at least one config file myself
- [ ] No major uncertainties remain

**Status**: Ready / Needs more research

**Next step**: Pass to add-provider skill for implementation across 6 streams
```

## Section Details

### Config Location Format

Use this format for config locations in the audit table:

```
~/.provider/config.toml          # User home directory (global)
.provider/rules.md               # Project root (project-level)
~/.provider/settings.json        # Global with specific filename
.provider/agents/custom.yaml     # Project subdirectory for specific feature
```

### Evidence Links

Evidence should always be a direct link to official documentation:

```
✓ [Cursor docs: Rules](https://cursor.sh/docs/features/rules)
✓ [GitHub Copilot: Agent Mode](https://docs.github.com/en/copilot/using-github-copilot)
✗ ❌ "I think this is supported" (no evidence)
✗ ❌ Blog post from 2020 (outdated)
```

### Confidence Levels

Mark your research confidence:

```
**Confidence level**: High
→ All 11 primitives verified in official docs, tested config files

**Confidence level**: Medium
→ 8/11 primitives verified, 3 still need confirmation from maintainers

**Confidence level**: Low
→ Limited documentation available, relying on inference and community posts
→ Recommend contacting provider maintainers before implementation
```

## Quality Checklist

Before passing your audit to add-provider:

- [ ] Every primitive has a support level
- [ ] Every support level has evidence (official docs link)
- [ ] Config locations are complete (both project and global)
- [ ] Evidence links are current (not outdated)
- [ ] I've tested at least 2-3 config files myself
- [ ] Support levels match the decision tree (see support-levels.md)
- [ ] Limitations are documented clearly
- [ ] No assumptions or guesses remain
