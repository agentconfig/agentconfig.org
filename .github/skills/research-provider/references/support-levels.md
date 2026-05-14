# Support Levels

Each of the 11 AI primitives is evaluated against a provider using standardized support levels.

## Definitions

**`full`** - Natively supported, documented, core feature
- The provider officially documents this feature
- It's part of the core product (not a paid add-on or beta)
- It works without workarounds or limitations
- Typical example: "GitHub Copilot's Agent Mode is a core feature with full documentation"

**`partial`** - Works with limitations or requires workarounds
- The provider supports it but with constraints
- Requires paid tier, plugin/extension, or documented workaround
- Works but not as seamlessly as competitors
- Typical example: "Cursor's Tool Integrations work but limited to specific providers"

**`diy`** - Possible but requires custom setup
- Not officially supported by the provider
- Requires user to build custom solution or integration
- Community workarounds exist
- Typical example: "Custom agents via external automation scripts"

**`none`** - Not possible
- The provider cannot support this primitive
- No workaround exists
- No community solution available
- Typical example: "A CLI-only tool cannot support IDE integration"

## Decision Tree

Use this flowchart to determine support level:

```
Does the provider officially document this feature?
├─ YES
│  ├─ Is it part of the core product?
│  │  ├─ YES → "full"
│  │  └─ NO
│  │     ├─ Requires paid tier? → "partial"
│  │     ├─ Requires plugin? → "partial"
│  │     ├─ Requires workaround? → "partial"
│  │     └─ Everything works smoothly? → "full"
│  └─ Does the documentation show limitations?
│     ├─ YES → "partial"
│     └─ NO → "full"
└─ NO
   ├─ Is there a community workaround?
   │  ├─ YES → "diy"
   │  └─ NO → "none"
   └─ Could this be implemented externally?
      ├─ YES → "diy"
      └─ NO → "none"
```

## Common Pitfalls

**❌ "I assumed this was supported"**
- Don't assume. Verify against official docs.
- Unsupported features waste implementation time.

**❌ "The documentation is outdated"**
- If docs seem outdated, verify with recent GitHub issues or discussion
- Add a comment noting the inconsistency
- Consider using "partial" support level if unsure

**❌ "I can't find the config file location"**
- Search official documentation thoroughly
- Check README in official GitHub repo
- Look at example projects/templates
- If still missing, contact maintainers or file an issue

**❌ "All providers do the same thing, right?"**
- No! Each provider implements primitives differently
- Example: Agent Mode looks different in Cursor vs Claude vs Copilot
- Research each provider individually

**❌ "I forgot to check both project and global config"**
- Every primitive needs TWO location entries
- One for project-level (.cursor/instructions.md)
- One for global/user-level (~/.cursor/config.toml)
- Look for both in provider docs

## Support Level Examples

### Example: GitHub Copilot

| Primitive | Level | Reason |
|-----------|-------|--------|
| Agent Mode | full | Documented core feature, native CLI support |
| Skills/Workflows | partial | Uses standard formats (AGENTS.md) with limitations |
| Tool Integrations (MCP) | full | Officially supported via config |
| Persistent Instructions | full | Core feature via instructions.md |
| Global Instructions | full | Supported via copilot-instructions.md |
| Path-Scoped Rules | partial | Supported but limited to .github/copilot-instructions.md |
| Slash Commands | full | Native support via settings |
| Custom Agents | partial | Limited to built-in agent types |
| Permissions & Guardrails | partial | Via policy files, limited scope |
| Lifecycle Hooks | none | Not documented or supported |
| Verification/Evals | partial | Indirect via tests, not first-class |

### Example: Cursor

| Primitive | Level | Reason |
|-----------|-------|--------|
| Agent Mode | full | Core feature, well-documented |
| Skills/Workflows | full | Supports AGENTS.md and custom workflows |
| Tool Integrations (MCP) | partial | Supported but limited |
| Persistent Instructions | full | .cursor/rules for project-level |
| Global Instructions | full | ~/.cursor/config.toml |
| Path-Scoped Rules | full | Folder-specific .cursorignore rules |
| Slash Commands | full | Native support |
| Custom Agents | full | Can create custom agents |
| Permissions & Guardrails | partial | Limited guardrails |
| Lifecycle Hooks | none | Not documented |
| Verification/Evals | none | Not available |

## Questions to Ask Yourself

1. **Is this documented in the provider's official docs?**
   - If no → can't use "full", consider "partial" or "diy"

2. **Have I tested this configuration myself?**
   - If possible, test before deciding support level

3. **Is this a core feature or an add-on?**
   - Core features are usually "full"
   - Add-ons might be "partial"

4. **Are there limitations or workarounds needed?**
   - With workarounds → "partial"
   - Without workarounds → "full"

5. **Would a typical user expect this to work?**
   - If yes and it does → "full"
   - If yes but with caveats → "partial"
   - If no and it doesn't work → "none"
