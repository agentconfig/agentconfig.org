# Subpage Proposals for agentconfig.org

This document outlines potential subpages based on the 9 AI primitives defined on the homepage.

## Current Pages

| Page | Path | Primitives Covered |
|------|------|-------------------|
| Homepage | `/` | Overview of all 9 primitives |
| Skills | `/skills/` | Skills / Workflows |
| Agents | `/agents/` | Custom Agents, Persistent Instructions, Path-Scoped Rules (partial) |

## Proposed Subpages

### High Priority (Distinct primitives with unique content)

#### 1. `/mcp/` - Tool Integrations (MCP)

**Why a dedicated page:** MCP (Model Context Protocol) is a rich topic covering external tool integration, server setup, and configuration for both Copilot and Claude. This is fundamentally different from other primitives and has significant configuration complexity.

**Content outline:**
- What is MCP and why it matters
- Setting up MCP servers (Copilot vs Claude)
- Common MCP servers (GitHub, databases, observability tools)
- Security considerations for tool permissions
- Building custom MCP servers

#### 2. `/commands/` - Slash Commands (Prompt Templates)

**Why a dedicated page:** Slash commands are a distinct authoring pattern from agent definitions. They're quick, reusable prompts with their own file format and frontmatter syntax.

**Content outline:**
- What are slash commands
- File locations and naming (`.github/prompts/*.prompt.md` vs `.claude/commands/*.md`)
- Using `$ARGUMENTS` and variables
- Example commands (test writer, commit message, code review)
- Tips for effective command design

#### 3. `/guardrails/` - Permissions & Guardrails

**Why a dedicated page:** Safety configuration deserves focused attention. This covers allow/deny lists, sandbox modes, approval workflows, and org policies.

**Content outline:**
- Overview of AI safety controls
- Claude Code: `settings.json` allow/deny lists and patterns
- Copilot: VS Code settings and org policies
- Permission scopes and what they control
- Recipes for common security patterns

### Medium Priority (Could be standalone or merged)

#### 4. `/hooks/` - Lifecycle Hooks

**Why it might warrant a page:** Hooks are Claude-specific but powerful for validation, logging, and custom behaviors. They require understanding of hook types, matchers, and shell scripting.

**Why it might not:** Currently Claude-only (Copilot has no equivalent). Could be a section within a "Claude Advanced" page instead.

**If standalone:**
- Hook types: PreToolUse, PostToolUse, Stop
- Matchers and when hooks trigger
- Example hooks (validation, audit logging, notifications)
- Testing and debugging hooks

#### 5. `/verification/` - Verification & Evals

**Why it might warrant a page:** Testing AI outputs is increasingly important as agents take more autonomous action.

**Why it might not:** This primitive is less about configuration files and more about practices. Much of it overlaps with standard CI/CD testing.

**If standalone:**
- Why verification matters for AI outputs
- Built-in verification (running tests, lint, typecheck)
- Custom eval scripts
- Golden answer testing patterns
- Human review workflows

### Lower Priority (Significant overlap with existing content)

#### 6. Global Instructions

**Why deprioritize:** Largely overlaps with Persistent Instructions (same format, different location). Could be a section in the Agents page.

**If standalone:** Focus on user-level config across projects, portable preferences, team vs individual settings.

#### 7. Agent Mode

**Why deprioritize:** Agent Mode is more of a runtime capability than a configuration primitive. It's the context in which other primitives operate.

**If standalone:** Could explain the difference between chat-style assistance vs agentic workflows, when to use each, and how primitives enhance agent mode.

## Primitives That Should NOT Get Dedicated Pages

These primitives are well-covered by existing pages or are too abstract for standalone content:

- **Persistent Instructions** - Covered thoroughly in `/agents/`
- **Path-Scoped Rules** - Covered in `/agents/` section 5
- **Custom Agents** - The entire `/agents/` page is essentially about this

## Recommended Implementation Order

1. **`/mcp/`** - High value, unique content, both providers support it
2. **`/commands/`** - High value, distinct pattern from agents
3. **`/guardrails/`** - Important for enterprise/security-conscious users
4. **`/hooks/`** - Only if there's demand; Claude-specific
5. **`/verification/`** - Consider as a blog post or guide instead

## Page Template Consistency

New pages should follow the established pattern:
- Hero section with title, description, and difficulty/topic badges
- Sidebar table of contents (sticky on desktop)
- Progressive disclosure: concepts → examples → further reading
- Code tabs showing Copilot vs Claude equivalents where applicable
- Mobile-responsive sidebar toggle

## Questions to Resolve

1. Should MCP get a dedicated page or be part of a broader "Integrations" page?
2. Should we have a "Recipes" or "Patterns" page instead of per-primitive pages?
3. Is there value in a "Getting Started" page that walks through a minimal setup?
