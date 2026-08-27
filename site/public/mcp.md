# MCP Tool Integrations Tutorial

Tutorial for connecting AI coding assistants to external tools using the Model Context Protocol (MCP).
Covers a first server connection, core primitives, installation, configuration scopes, provider details, and security.

## Tutorial Sections

- 1. Connect One Server (beginner)
- 2. What is MCP? (beginner)
- 3. Why MCP Matters (beginner)
- 4. Core Primitives (beginner)
- 5. Installing MCP Servers (intermediate)
- 6. Configuration Scopes (intermediate)
- 7. Check Your Provider Details (intermediate)
- 8. Security Considerations (advanced)
- 9. Practical Examples (advanced)
- 10. Further Reading

## Section Details

### 1. Connect One Server

Start with the GitHub MCP server and confirm a read-only operation such as listing pull requests:

**GitHub Copilot — `.vscode/mcp.json`:**

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

**Claude Code — `Terminal`:**

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
claude mcp list
```

**Cursor — `.cursor/mcp.json`:**

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

**OpenAI Codex — `.codex/config.toml`:**

```toml
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
```

### 2. What is MCP?

The Model Context Protocol (MCP) is an open standard that connects AI applications
to external tools, databases, and APIs. Think of it like a USB-C port for AI—one
standardized interface that works across different tools.

```
Think of MCP like a USB-C port for AI:

┌─────────────────┐     ┌─────────────────┐
│   AI Assistant  │     │  External Tool  │
│  (Claude, etc.) │────▶│   (Database,    │
│                 │◀────│   API, Files)   │
└─────────────────┘     └─────────────────┘
         │                      ▲
         │    ┌─────────────────┘
         │    │
         ▼    ▼
    ┌───────────────┐
    │  MCP Protocol │
    │  (Standardized│
    │   Interface)  │
    └───────────────┘

Without MCP: Custom integration for each tool
With MCP: One standard protocol for all tools
```

MCP follows a client-server architecture:

```
MCP Architecture:

┌─────────────────────────────────────────────┐
│                 MCP Host                    │
│  (Claude Code, VS Code + Copilot, etc.)     │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐           │
│  │ MCP Client  │  │ MCP Client  │  ...      │
│  │ (Server A)  │  │ (Server B)  │           │
│  └──────┬──────┘  └──────┬──────┘           │
└─────────┼────────────────┼──────────────────┘
          │                │
          ▼                ▼
    ┌───────────┐    ┌───────────┐
    │ MCP Server│    │ MCP Server│
    │ (GitHub)  │    │ (Database)│
    └───────────┘    └───────────┘
```

### 3. Why MCP Matters

With MCP servers connected, AI assistants can:
- Query databases naturally
- Manage GitHub issues and PRs
- Analyze monitoring data from Sentry
- Access files outside the current workspace

### 4. Core Primitives

MCP servers expose three types of capabilities:

**Tools** - Executable functions the AI can invoke:
```json
// MCP Tool Definition
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or zip code"
      }
    },
    "required": ["location"]
  }
}

// Tool Response
{
  "content": [{
    "type": "text",
    "text": "Temperature: 72°F, Partly cloudy"
  }]
}
```

**Resources** - Contextual data the AI can read:
```json
// MCP Resource Definition
{
  "uri": "file:///project/src/main.rs",
  "name": "main.rs",
  "description": "Primary application entry point",
  "mimeType": "text/x-rust"
}

// Resource Content
{
  "uri": "file:///project/src/main.rs",
  "mimeType": "text/x-rust",
  "text": "fn main() {\n    println!(\"Hello world!\");\n}"
}
```

**Prompts** - Reusable templates for interactions:
```json
// MCP Prompt Definition
{
  "name": "code_review",
  "description": "Review code for quality and improvements",
  "arguments": [
    {
      "name": "code",
      "description": "The code to review",
      "required": true
    }
  ]
}

// Prompt Response (becomes chat messages)
{
  "messages": [{
    "role": "user",
    "content": {
      "type": "text",
      "text": "Please review this code:\n..."
    }
  }]
}
```

### 5. Installing MCP Servers

Providers support different combinations of local and remote transports and use different
configuration methods. Add the server with the documented file or command, then restart or
reload the provider if it does not discover the server immediately.

**GitHub Copilot — `.vscode/mcp.json`:**

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

**Claude Code — `Terminal`:**

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
claude mcp list
```

**Cursor — `.cursor/mcp.json`:**

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

**OpenAI Codex — `.codex/config.toml`:**

```toml
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
```

### 6. Configuration Scopes

MCP servers can be configured at different levels—personal, project, or organization-wide.

**GitHub Copilot:**

| Scope | Location | Visibility |
|-------|----------|------------|
| Workspace | `.vscode/mcp.json` | Team (shared) |
| User Profile | `VS Code profile settings` | You only (profile) |
| Dev Container | `devcontainer.json customizations.vscode` | Container (shared) |

[Official GitHub Copilot documentation](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp)

**Claude Code:**

| Scope | Location | Visibility |
|-------|----------|------------|
| Local (default) | `~/.claude.json (per-project path)` | You only (1 project) |
| Project | `.mcp.json (project root)` | Team (shared) |
| User | `~/.claude.json (global section)` | You only (all projects) |

[Official Claude Code documentation](https://code.claude.com/docs/en/mcp)

**Cursor:**

| Scope | Location | Visibility |
|-------|----------|------------|
| Project | `.cursor/mcp.json` | Team (shared) |
| User | `~/.cursor/mcp.json` | You only (all projects) |

[Official Cursor documentation](https://cursor.com/docs/context/mcp)

**OpenAI Codex:**

| Scope | Location | Visibility |
|-------|----------|------------|
| Project | `.codex/config.toml` | Team (shared) |
| User | `~/.codex/config.toml` | You only (all projects) |

[Official OpenAI Codex documentation](https://developers.openai.com/codex/extend/mcp)

### 7. Check Your Provider Details

| Provider | Implementation | Documented location | Support | Source |
|----------|----------------|---------------------|---------|--------|
| GitHub Copilot | MCP servers and tool calling | .vscode/mcp.json, VS Code settings.json (also Visual Studio, JetBrains IDEs, Xcode, Eclipse) | full | [Provider documentation](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp) |
| Claude Code | MCP servers and tool calling | .mcp.json or ~/.claude.json | full | [Provider documentation](https://code.claude.com/docs/en/mcp) |
| Cursor | MCP servers with stdio, SSE, and Streamable HTTP transports | .cursor/mcp.json, ~/.cursor/mcp.json | full | [Provider documentation](https://cursor.com/docs/context/mcp) |
| OpenAI Codex | MCP servers with stdio and Streamable HTTP transports | ~/.codex/config.toml, .codex/config.toml | full | [Provider documentation](https://developers.openai.com/codex/extend/mcp) |

### 8. Security Considerations

```
Security Checklist:

✓ Only install servers from trusted sources
✓ Review server configuration before starting
✓ Avoid hardcoding API keys (use input variables)
✓ Use project scope for team-approved servers only
✓ Understand what permissions each server requests

# Claude Code: Reset approval choices
claude mcp reset-project-choices

# VS Code: Reset trust
Command Palette → MCP: Reset Trust
```

Enterprise management with allowlists:
```json
// Managed settings with allowlist/denylist
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverName": "sentry" },
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverCommand": ["npx", "-y", "@approved/server"] }
  ],
  "deniedMcpServers": [
    { "serverName": "dangerous-server" },
    { "serverUrl": "https://*.untrusted.com/*" }
  ]
}
```

### 9. Practical Examples

**GitHub Integration:**
```bash
# Connect to GitHub MCP server

# Claude Code
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
/mcp  # Authenticate if needed

# VS Code (.vscode/mcp.json)
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp"
    }
  }
}

# Now you can:
> "List my open PRs"
> "Create an issue for this bug"
> "Review PR #456 and suggest improvements"
```

**Database Queries:**
```bash
# Connect to a PostgreSQL database

# Claude Code
claude mcp add --transport stdio db \
  -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@localhost:5432/analytics"

# VS Code (.vscode/mcp.json)
{
  "servers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub"],
      "env": {
        "DATABASE_URL": "${input:db-url}"
      }
    }
  },
  "inputs": [{
    "id": "db-url",
    "type": "promptString",
    "description": "Database connection string",
    "password": true
  }]
}

# Now you can:
> "What's our total revenue this month?"
> "Show me the schema for the orders table"
> "Find customers who haven't purchased in 90 days"
```

**Error Monitoring (Sentry):**
```bash
# Connect to Sentry for error monitoring

# Claude Code
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
/mcp  # Authenticate with your Sentry account

# VS Code (.vscode/mcp.json)
{
  "servers": {
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}

# Now you can:
> "What are the most common errors in the last 24 hours?"
> "Show me the stack trace for error ID abc123"
> "Which deployment introduced these new errors?"
```

### 10. Further Reading

- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction): The official introduction to MCP—an open standard for connecting AI to external tools.
- [Claude Code MCP Documentation](https://code.claude.com/docs/en/mcp): Complete guide to using MCP servers with Claude Code, including installation and configuration.
- [VS Code MCP Servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers): How to configure and use MCP servers with GitHub Copilot in VS Code.
- [MCP Specification](https://modelcontextprotocol.io/specification/latest): The complete technical specification for the Model Context Protocol.
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers): Repository of official and community-contributed MCP server implementations.
- [GitHub MCP Server Registry](https://github.com/mcp): Browse and discover MCP servers from the official GitHub registry.
