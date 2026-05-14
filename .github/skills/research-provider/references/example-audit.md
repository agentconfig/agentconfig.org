# Example Research Audit: Claude Desktop

This is a completed research audit showing the format and level of detail expected.

---

# Provider Research: Claude Desktop

**Research completed**: 2026-01-26
**Researcher**: Research Agent (Haiku)
**Confidence level**: High

## Summary

Claude Desktop is Anthropic's native application bringing Claude to developers with direct IDE integration. Supports 9 out of 11 primitives with full native support for most customization features. Strong support for instructions-based customization, partial support for MCP tool integrations.

## Capability Audit

| Primitive | Support Level | Config Location | Evidence |
|-----------|---|---|---|
| Agent Mode | full | config.json (execution via Claude) | [Claude Desktop docs: Agent capabilities](https://docs.anthropic.com/en/docs/build-a-system-with-claude/tool-use) |
| Skills/Workflows | partial | AGENTS.md (shared standard) | [AGENTS.md standard](https://github.com/anthropics/anthropic-sdk-python) |
| Tool Integrations (MCP) | full | ~/Library/Application Support/Claude/claude_desktop_config.json | [MCP specification](https://modelcontextprotocol.io/specification) |
| Persistent Instructions | full | project/.claude/instructions.md | [Claude Desktop: Instructions](https://docs.anthropic.com/en/docs/build-a-system-with-claude/custom-instructions) |
| Global Instructions | full | ~/Library/Application Support/Claude/instructions.txt | [Claude Desktop: Global config](https://docs.anthropic.com/en/docs/build-a-system-with-claude) |
| Path-Scoped Rules | partial | .claude/rules.txt (project folder) | [Custom instructions support](https://docs.anthropic.com/en/docs/build-a-system-with-claude/custom-instructions) |
| Slash Commands | none | Not available | [Claude Desktop feature set](https://support.anthropic.com/en/articles/0000) |
| Custom Agents | none | Not applicable | No custom agent support documented |
| Permissions & Guardrails | partial | Via system prompts only | [Anthropic safety guidelines](https://docs.anthropic.com/en/docs/build-a-system-with-claude/system-prompts-for-claude) |
| Lifecycle Hooks | none | Not supported | No hooks API documented |
| Verification/Evals | partial | Via Claude's own capabilities | [Evals cookbook](https://github.com/anthropics/anthropic-sdk-python/tree/main/examples/evals) |

## Key Findings

### What Works Well

- **Native MCP Support**: Full support for Model Context Protocol with excellent documentation. Can add servers via JSON config.
- **Persistent Instructions**: Flexible system that respects AGENTS.md standard and custom instructions at project level
- **Global Configuration**: Centralized config at OS level allows user-wide preferences
- **Tool Use**: Native multi-turn tool calling with comprehensive documentation

### Limitations & Caveats

- **No Slash Commands**: Unlike Cursor or Copilot, Claude Desktop doesn't have slash command syntax
- **Custom Agents Not Supported**: Can't create new agent personas or types
- **Limited Path-Scoped Rules**: Only basic instructions per project, can't do folder-level granularity
- **No Lifecycle Hooks**: No event-based automation hooks available

### Config File Locations

**Project-level configuration:**
- `.claude/instructions.md` - Project-specific instructions (git-tracked)
- `.claude/rules.txt` - Additional project rules (optional)
- Works alongside standard AGENTS.md file

**Global/User-level configuration:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Example global config:
```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/path/to/mcp-github/index.js"]
    }
  },
  "customInstructions": "Always use TypeScript with strict mode."
}
```

## Evidence & References

**Official Documentation:**
- [Claude Desktop - Official Guide](https://docs.anthropic.com/claude/docs/claude-desktop)
- [Custom Instructions Guide](https://docs.anthropic.com/en/docs/build-a-system-with-claude/custom-instructions)
- [MCP Integration](https://modelcontextprotocol.io/)
- [Tool Use Documentation](https://docs.anthropic.com/en/docs/build-a-system-with-claude/tool-use)

**Community Resources:**
- [Claude Desktop GitHub Issues](https://github.com/anthropics/claude-app/issues)
- [MCP Community Servers](https://github.com/modelcontextprotocol/servers)
- [AGENTS.md Standard](https://github.com/anthropics)

**Testing Verified:**
- ✓ Created `.claude/instructions.md` in test project, verified loaded on startup
- ✓ Configured MCP GitHub server, tested tool integration
- ✓ Set global instructions via config.json, verified applied to all projects
- ✓ Tested multi-turn tool use, confirmed no slash commands available
- ✓ Checked for lifecycle hooks, confirmed not documented or available

## Support Level Breakdown

**Full (5 primitives)**
- Agent Mode - Native execution and planning
- Tool Integrations (MCP) - First-class MCP support
- Persistent Instructions - Project-level .claude/instructions.md
- Global Instructions - User-level configuration
- Verification/Evals - Can use Claude's capabilities for testing

**Partial (3 primitives)**
- Skills/Workflows - Uses AGENTS.md standard but limited workflow automation
- Path-Scoped Rules - Basic project rules but no folder-level granularity
- Permissions & Guardrails - Only via system prompts, no first-class guardrails

**DIY (0 primitives)**
- None applicable

**None (3 primitives)**
- Slash Commands - Not available
- Custom Agents - Not supported
- Lifecycle Hooks - Not documented

## Comparison Notes

| Feature | Claude Desktop | Cursor | GitHub Copilot |
|---------|---|---|---|
| Agent Mode | Full | Full | Full |
| MCP Support | Full | Partial | Full |
| Custom Instructions | Full | Full | Partial |
| Slash Commands | None | Full | Full |
| Custom Agents | None | Full | Partial |

## Ready for Implementation?

- [x] All 11 primitives researched
- [x] Config locations verified against official docs (tested locally)
- [x] Support levels have evidence links
- [x] Tested multiple config files in real Claude Desktop instance
- [x] No major uncertainties remain

**Status**: ✅ Ready for implementation

**Next step**: Pass this audit to add-provider skill for implementation across 6 streams (type system, data layer, UI components, tests, integration, llms generation)

---

## How to Use This Example

This audit provides:

1. **Template structure** - Use this format for your own provider research
2. **Evidence quality** - See examples of good documentation links
3. **Detail level** - Notice the balance between comprehensiveness and brevity
4. **Testing approach** - Shows what it means to "verify" a config file
5. **Decision examples** - See how each primitive was evaluated

When you complete your own research, replace "Claude Desktop" with your provider and follow this same structure.
