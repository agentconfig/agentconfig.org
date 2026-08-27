# Cursor Provider Research Requirements

## Overview

This document outlines the specific research needed to add Cursor as a third provider in the agentconfig.org comparison system. For each of the 11 AI primitives, we need to determine how Cursor implements the feature (if at all).

## Research Template

For each primitive, document the following:

```
Primitive: [Name]
Support Level: [full | partial | none | diy]
Implementation: [Description of how Cursor implements this feature]
Location: [File path, settings location, or feature name in Cursor]
Notes: [Any additional context, limitations, or special considerations]
```

## The 11 Primitives to Research

### CAPABILITY (Execution)

#### 1. Agent Mode
**What it is**: Multi-step execution with planning and tool use. The AI can autonomously break down tasks, plan approaches, and execute multiple steps.

**Research questions**:
- Does Cursor have agentic capabilities (multi-turn, planning, autonomous execution)?
- Can Cursor use tools/functions in an agentic workflow?
- Is there a specific "agent mode" feature or setting?

**Where to look**:
- Cursor Composer feature
- Cursor Chat capabilities
- Cursor Command-K behavior
- Cursor documentation on autonomous features

---

#### 2. Skills / Workflows
**What it is**: Reusable skill modules or workflow definitions that can be invoked to perform specific tasks.

**Research questions**:
- Does Cursor support custom reusable workflows or skills?
- Can users define multi-step procedures that Cursor can execute?
- Is there a skills directory or workflow file format?

**Where to look**:
- Cursor rules system
- Custom commands or macros
- .cursorrules file capabilities
- Community-shared workflows

---

#### 3. Tool Integrations (MCP)
**What it is**: Integration with Model Context Protocol servers for extended tool capabilities.

**Research questions**:
- Does Cursor support MCP (Model Context Protocol)?
- Can Cursor connect to external tool servers?
- What's the configuration mechanism for tools/integrations?

**Where to look**:
- Cursor MCP documentation
- Cursor settings for tool integrations
- API integrations and extensions
- Third-party tool support

---

### CUSTOMIZATION (Instructions)

#### 4. Persistent Instructions
**What it is**: Project-level instructions that persist across sessions and apply to all AI interactions within a project.

**Research questions**:
- What is Cursor's equivalent of project-level persistent context?
- Is there a dedicated file for project instructions?
- How are .cursorrules files used?

**Where to look**:
- `.cursorrules` file format and capabilities
- `.cursor/` directory
- Project-level settings in Cursor
- Cursor documentation on context files

---

#### 5. Global Instructions
**What it is**: User-level global configuration that applies across all projects.

**Research questions**:
- Does Cursor support user-level global instructions?
- Where are global settings stored?
- Can users define default behaviors across all projects?

**Where to look**:
- Cursor user settings
- Global configuration files
- User preferences in Cursor app
- Settings sync mechanism

---

#### 6. Path-Scoped Rules
**What it is**: Rules or instructions that only apply to specific file patterns or paths (e.g., "for all .tsx files, use this style").

**Research questions**:
- Can Cursor rules be scoped to specific file patterns?
- Does .cursorrules support glob patterns or path matching?
- Are there file-specific or directory-specific rules?

**Where to look**:
- .cursorrules file format specification
- Path matching capabilities
- Directory-level rules
- File type-specific configurations

---

#### 7. Slash Commands
**What it is**: Custom commands that can be invoked with a `/` prefix to trigger specific behaviors or workflows.

**Research questions**:
- Does Cursor support custom slash commands?
- Can users define their own / commands?
- What's the mechanism for creating commands?

**Where to look**:
- Cursor Chat / commands
- Custom command definitions
- Command configuration files
- Built-in vs custom commands

---

### CONTROL (Safety)

#### 8. Custom Agents
**What it is**: User-defined agents with specific roles, tools, and permissions.

**Research questions**:
- Can users create custom agents in Cursor?
- Is there an agent definition file format?
- Can agents be given specific tool restrictions or roles?

**Where to look**:
- Cursor agent configuration
- Custom AI personas or modes
- Agent definition files
- Role-based AI configurations

---

#### 9. Permissions & Guardrails
**What it is**: Controls for what the AI can access, modify, or execute. Allow/deny lists, file access controls, command restrictions.

**Research questions**:
- What permissions and safety controls does Cursor provide?
- Can users restrict file access or command execution?
- Are there allow/deny lists for files or actions?
- Is there a sandbox or permission system?

**Where to look**:
- Cursor security settings
- File access controls
- Command execution permissions
- Privacy and safety features

---

#### 10. Lifecycle Hooks
**What it is**: Pre/post execution hooks that run before or after the AI uses tools (e.g., run linter before committing).

**Research questions**:
- Does Cursor support pre/post tool execution hooks?
- Can users define callbacks or triggers?
- Is there a hooks configuration system?

**Where to look**:
- Cursor hooks or callbacks
- Pre-commit integrations
- Event-based triggers
- Workflow automation hooks

---

#### 11. Verification / Evals
**What it is**: Built-in mechanisms for running tests, linters, or validation as part of AI workflows.

**Research questions**:
- How does Cursor handle test execution and validation?
- Can Cursor run tests as part of its workflow?
- Are there built-in verification mechanisms?

**Where to look**:
- Cursor terminal integration
- Test runner integrations
- Built-in verification tools
- Cursor's approach to code validation

---

## Research Sources

### Primary Sources
1. **Official Documentation**
   - https://docs.cursor.com
   - https://cursor.com/features
   - Cursor changelog and release notes

2. **Configuration Files**
   - `.cursorrules` file format
   - Cursor settings.json schema
   - Project configuration examples

3. **Community Resources**
   - Cursor GitHub discussions
   - Cursor Discord/community forums
   - Community-shared rules and configurations
   - Reddit r/cursor

4. **Direct Testing**
   - Install Cursor IDE
   - Test features hands-on
   - Explore settings and configuration options
   - Create test projects to validate capabilities

### Secondary Sources
- Cursor blog posts and announcements
- YouTube tutorials and walkthroughs
- Twitter/X announcements from Cursor team
- Comparison articles (Cursor vs Copilot, etc.)

## Data Collection Format

Use this JSON structure to document findings:

```json
{
  "primitive_id": "agent-mode",
  "primitive_name": "Agent Mode",
  "cursor": {
    "support_level": "full",
    "implementation": "Cursor Composer with multi-step autonomous workflows",
    "location": "Cursor Composer panel",
    "notes": "Requires Cursor Pro subscription. Supports tool calling and multi-turn planning.",
    "verified": true,
    "verified_date": "2026-01-17",
    "source": "https://docs.cursor.com/composer"
  }
}
```

## Verification Checklist

For each primitive:
- [ ] Support level determined (full/partial/none/diy)
- [ ] Implementation description written
- [ ] Location/file path identified
- [ ] Source documentation cited
- [ ] Tested in actual Cursor IDE (if applicable)
- [ ] Notes added for limitations or special cases
- [ ] Cross-referenced with at least 2 sources

## Output Format

Once research is complete, compile findings into:

1. **Structured JSON file**: `cursor-primitives-data.json`
   - Machine-readable format for easy integration into data layer

2. **Markdown summary**: `cursor-research-findings.md`
   - Human-readable summary with citations and notes
   - Include screenshots where helpful
   - Document any ambiguities or uncertainties

3. **Comparison notes**: `cursor-vs-copilot-vs-claude.md`
   - Highlight unique Cursor features not in other providers
   - Note any primitives where Cursor leads/lags
   - Suggest any new primitives Cursor might inspire

## Research Quality Standards

**Good research example**:
```
Primitive: Agent Mode
Support Level: full
Implementation: Cursor Composer provides multi-step autonomous workflows with tool calling and iterative refinement
Location: Cursor Composer (Cmd+I), accessible via composer panel
Notes: Requires Cursor Pro subscription. Supports up to 50 messages in a single composer session. Can invoke terminal commands, edit multiple files, and self-iterate.
Source: https://docs.cursor.com/composer, tested on Cursor v0.42.0
Verified: 2026-01-17
```

**Poor research example**:
```
Primitive: Agent Mode
Support Level: maybe?
Implementation: probably has this
Location: somewhere in Cursor
Notes: need to check
```

## Next Steps After Research

1. Validate all findings with team review
2. Convert to TypeScript data structures
3. Update provider types to include 'cursor'
4. Add Cursor data to primitives.ts
5. Add Cursor data to comparison.ts
6. Update UI components to display Cursor column
7. Write E2E tests for 3-provider layout
8. Generate updated llms.txt files

## Open Questions

Document any questions that arise during research:
- [ ] Does Cursor plan to add MCP support? (if not currently supported)
- [ ] Are there Cursor-specific primitives not covered by our 11?
- [ ] What's Cursor's roadmap for agentic features?
- [ ] Are there significant differences between Cursor free vs Pro for these primitives?
- [ ] How does Cursor's .cursorrules compare to .github/copilot-instructions.md in capabilities?

## Timeline Considerations

**Estimated research time per primitive**: 30-60 minutes
**Total research time**: 6-11 hours (for the tracked primitives)
**Verification and documentation**: 2-4 hours
**Total**: 1-2 days for thorough research

**Priority order** (if time-constrained):
1. High Priority: Persistent Instructions, Agent Mode, Skills
2. Medium Priority: Global Instructions, Slash Commands, Permissions
3. Lower Priority: Lifecycle Hooks, Path-Scoped Rules, Custom Agents
4. Nice to Have: Verification, Tool Integrations, MCP support

This allows us to launch with partial data and iterate.
