# MCP Tool Integrations Tutorial

Tutorial for connecting AI coding assistants to external tools using the Model Context Protocol (MCP).
Covers core primitives, server installation, configuration scopes, and provider comparison.

## Tutorial Sections

- 1. What is MCP? (beginner)
- 2. Why MCP Matters (beginner)
- 3. Core Primitives (beginner)
- 4. Installing MCP Servers (intermediate)
- 5. Configuration Scopes (intermediate)
- 6. Provider Comparison (intermediate)
- 7. Security Considerations (advanced)
- 8. Practical Examples (advanced)
- 9. Further Reading

## Section Details

### 1. What is MCP?

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

### 2. Why MCP Matters

With MCP servers connected, AI assistants can:
- Query databases naturally
- Manage GitHub issues and PRs
- Analyze monitoring data from Sentry
- Access files outside the current workspace

### 3. Core Primitives

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

### 4. Installing MCP Servers

**Claude Code (HTTP):**
```bash
# Add a remote HTTP server
claude mcp add --transport http <name> <url>

# Example: Connect to GitHub
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# Example: Connect to Sentry with authentication
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**Claude Code (stdio):**
```bash
# Add a local stdio server
claude mcp add [options] <name> -- <command> [args...]

# Example: Add a database server
claude mcp add --transport stdio db \
  -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:pass@localhost:5432/mydb"

# Example: With environment variable for API key
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY \
  airtable -- npx -y airtable-mcp-server
```

**VS Code + Copilot:**
```json
// .vscode/mcp.json
{
  "servers": {
    "github-mcp": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "database": {
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub"],
      "env": {
        "DB_URL": "${input:database-url}"
      }
    }
  },
  "inputs": [
    {
      "id": "database-url",
      "type": "promptString",
      "description": "Database connection URL",
      "password": true
    }
  ]
}
```

### 5. Configuration Scopes

Both providers support multiple configuration scopes:

| Scope | Claude Code | VS Code |
|-------|-------------|---------|
| Local/Workspace | ~/.claude.json | .vscode/mcp.json |
| Project | .mcp.json | .vscode/mcp.json |
| User | ~/.claude.json | User profile |
| Enterprise | managed-mcp.json | Settings + MDM |

### 6. Provider Comparison

| Feature | Claude Code | VS Code/Copilot |
|---------|-------------|-----------------|
| Transports | stdio, http, sse | stdio, http, sse |
| Tools | ✓ | ✓ |
| Resources | ✓ | ✓ |
| Prompts | ✓ (/mcp) | ✓ (/mcp.*) |
| Configuration | CLI + JSON | JSON + UI |
| Server Discovery | Manual | Gallery + Auto |
| Tool Search | ✓ (auto 10%+) | Via tool picker |
| Enterprise Control | managed-mcp.json | Settings + MDM |

### 7. Security Considerations

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

### 8. Practical Examples

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

## Further Reading

- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction): The official introduction to MCP—an open standard for connecting AI to external tools.
- [Claude Code MCP Documentation](https://docs.anthropic.com/en/docs/claude-code/mcp): Complete guide to using MCP servers with Claude Code, including installation and configuration.
- [VS Code MCP Servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers): How to configure and use MCP servers with GitHub Copilot in VS Code.
- [MCP Specification](https://modelcontextprotocol.io/specification/latest): The complete technical specification for the Model Context Protocol.
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers): Repository of official and community-contributed MCP server implementations.
- [GitHub MCP Server Registry](https://github.com/mcp): Browse and discover MCP servers from the official GitHub registry.
