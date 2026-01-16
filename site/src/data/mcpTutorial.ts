import type { TocItem } from '@/components/TableOfContents'

export interface FurtherReadingLink {
  title: string
  url: string
  source: string
  description: string
}

export const tocItems: readonly TocItem[] = [
  { id: 'what-is-mcp', label: '1. What is MCP?', level: 'beginner' },
  { id: 'why-mcp-matters', label: '2. Why MCP Matters', level: 'beginner' },
  { id: 'core-primitives', label: '3. Core Primitives', level: 'beginner' },
  { id: 'installing-servers', label: '4. Installing MCP Servers', level: 'intermediate' },
  { id: 'configuration-scopes', label: '5. Configuration Scopes', level: 'intermediate' },
  { id: 'provider-comparison', label: '6. Provider Comparison', level: 'intermediate' },
  { id: 'security-considerations', label: '7. Security Considerations', level: 'advanced' },
  { id: 'practical-examples', label: '8. Practical Examples', level: 'advanced' },
  { id: 'further-reading', label: '9. Further Reading' },
] as const

export const furtherReadingLinks: readonly FurtherReadingLink[] = [
  {
    title: 'Model Context Protocol Introduction',
    url: 'https://modelcontextprotocol.io/introduction',
    source: 'MCP Official',
    description: 'The official introduction to MCP—an open standard for connecting AI to external tools.',
  },
  {
    title: 'Claude Code MCP Documentation',
    url: 'https://docs.anthropic.com/en/docs/claude-code/mcp',
    source: 'Anthropic',
    description: 'Complete guide to using MCP servers with Claude Code, including installation and configuration.',
  },
  {
    title: 'VS Code MCP Servers',
    url: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers',
    source: 'VS Code Docs',
    description: 'How to configure and use MCP servers with GitHub Copilot in VS Code.',
  },
  {
    title: 'MCP Specification',
    url: 'https://modelcontextprotocol.io/specification/latest',
    source: 'MCP Official',
    description: 'The complete technical specification for the Model Context Protocol.',
  },
  {
    title: 'Official MCP Servers',
    url: 'https://github.com/modelcontextprotocol/servers',
    source: 'GitHub',
    description: 'Repository of official and community-contributed MCP server implementations.',
  },
  {
    title: 'GitHub MCP Server Registry',
    url: 'https://github.com/mcp',
    source: 'GitHub',
    description: 'Browse and discover MCP servers from the official GitHub registry.',
  },
] as const

export const codeSamples: Record<string, string> = {
  mcpConcept: `Think of MCP like a USB-C port for AI:

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
With MCP: One standard protocol for all tools`,

  mcpArchitecture: `MCP Architecture:

┌─────────────────────────────────────────────┐
│                 MCP Host                     │
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
    └───────────┘    └───────────┘`,

  toolPrimitive: `// MCP Tool Definition
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
}`,

  resourcePrimitive: `// MCP Resource Definition
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
  "text": "fn main() {\\n    println!(\\"Hello world!\\");\\n}"
}`,

  promptPrimitive: `// MCP Prompt Definition
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
      "text": "Please review this code:\\n..."
    }
  }]
}`,

  claudeHttpServer: `# Add a remote HTTP server
claude mcp add --transport http <name> <url>

# Example: Connect to GitHub
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# Example: Connect to Sentry with authentication
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`,

  claudeStdioServer: `# Add a local stdio server
claude mcp add [options] <name> -- <command> [args...]

# Example: Add a database server
claude mcp add --transport stdio db \\
  -- npx -y @bytebase/dbhub \\
  --dsn "postgresql://user:pass@localhost:5432/mydb"

# Example: With environment variable for API key
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY \\
  airtable -- npx -y airtable-mcp-server`,

  claudeManageServers: `# List all configured servers
claude mcp list

# Get details for a specific server
claude mcp get github

# Remove a server
claude mcp remove github

# Check server status (within Claude Code)
/mcp`,

  vscodeMcpJson: `// .vscode/mcp.json
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
        "DB_URL": "\${input:database-url}"
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
}`,

  vscodeUserConfig: `// User-level MCP configuration
// Access via: MCP: Open User Configuration

{
  "servers": {
    "personal-api": {
      "type": "http",
      "url": "https://api.myservice.com/mcp",
      "headers": {
        "Authorization": "Bearer \${input:api-token}"
      }
    }
  }
}`,

  projectMcpJson: `.mcp.json (Project root - for Claude Code)
{
  "mcpServers": {
    "project-db": {
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub"],
      "env": {
        "DB_URL": "\${DB_URL:-postgresql://localhost/dev}"
      }
    }
  }
}`,

  claudeScopes: `Configuration Scopes (Claude Code):

┌─────────────────────────────────────────────────┐
│ SCOPE        │ LOCATION              │ VISIBILITY│
├──────────────┼───────────────────────┼───────────┤
│ Local        │ ~/.claude.json        │ You only  │
│ (default)    │ (per-project path)    │ (1 project)│
├──────────────┼───────────────────────┼───────────┤
│ Project      │ .mcp.json             │ Team      │
│              │ (project root)        │ (shared)  │
├──────────────┼───────────────────────┼───────────┤
│ User         │ ~/.claude.json        │ You only  │
│              │ (global section)      │ (all proj)│
└──────────────┴───────────────────────┴───────────┘

# Add with specific scope
claude mcp add --transport http stripe --scope local \\
  https://mcp.stripe.com

claude mcp add --transport http shared-api --scope project \\
  https://mcp.company.com`,

  vscodeScopes: `Configuration Scopes (VS Code + Copilot):

┌─────────────────────────────────────────────────┐
│ SCOPE        │ LOCATION              │ VISIBILITY│
├──────────────┼───────────────────────┼───────────┤
│ Workspace    │ .vscode/mcp.json      │ Team      │
│              │                       │ (shared)  │
├──────────────┼───────────────────────┼───────────┤
│ User Profile │ (VS Code profile)     │ You only  │
│              │                       │ (profile) │
├──────────────┼───────────────────────┼───────────┤
│ Dev Container│ devcontainer.json     │ Container │
│              │ customizations.vscode │ (shared)  │
└──────────────┴───────────────────────┴───────────┘

Commands:
• MCP: Open Workspace Folder Configuration
• MCP: Open User Configuration
• MCP: Add Server → choose scope`,

  devcontainerMcp: `// devcontainer.json
{
  "image": "mcr.microsoft.com/devcontainers/typescript-node",
  "customizations": {
    "vscode": {
      "mcp": {
        "servers": {
          "playwright": {
            "command": "npx",
            "args": ["-y", "@microsoft/mcp-server-playwright"]
          },
          "database": {
            "command": "npx",
            "args": ["-y", "@bytebase/dbhub"],
            "env": {
              "DB_URL": "\${localEnv:DATABASE_URL}"
            }
          }
        }
      }
    }
  }
}`,

  providerComparison: `┌────────────────────┬─────────────────┬─────────────────┐
│ Feature            │ Claude Code     │ VS Code/Copilot │
├────────────────────┼─────────────────┼─────────────────┤
│ Transports         │ stdio, http,    │ stdio, http,    │
│                    │ sse             │ sse             │
├────────────────────┼─────────────────┼─────────────────┤
│ Tools              │ ✓               │ ✓               │
├────────────────────┼─────────────────┼─────────────────┤
│ Resources          │ ✓               │ ✓               │
├────────────────────┼─────────────────┼─────────────────┤
│ Prompts            │ ✓ (/mcp)        │ ✓ (/mcp.*)      │
├────────────────────┼─────────────────┼─────────────────┤
│ Configuration      │ CLI + JSON      │ JSON + UI       │
├────────────────────┼─────────────────┼─────────────────┤
│ Server Discovery   │ Manual          │ Gallery + Auto  │
├────────────────────┼─────────────────┼─────────────────┤
│ Tool Search        │ ✓ (auto 10%+)   │ Via tool picker │
├────────────────────┼─────────────────┼─────────────────┤
│ Enterprise Control │ managed-mcp.json│ Settings + MDM  │
└────────────────────┴─────────────────┴─────────────────┘`,

  securityTrust: `Security Checklist:

✓ Only install servers from trusted sources
✓ Review server configuration before starting
✓ Avoid hardcoding API keys (use input variables)
✓ Use project scope for team-approved servers only
✓ Understand what permissions each server requests

# Claude Code: Reset approval choices
claude mcp reset-project-choices

# VS Code: Reset trust
Command Palette → MCP: Reset Trust`,

  managedMcp: `// /etc/claude-code/managed-mcp.json (Linux)
// /Library/Application Support/ClaudeCode/managed-mcp.json (macOS)
{
  "mcpServers": {
    "company-github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"]
    }
  }
}

// When deployed: Users CANNOT add their own servers`,

  allowDenyLists: `// Managed settings with allowlist/denylist
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
}`,

  exampleGitHub: `# Connect to GitHub MCP server

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
> "Review PR #456 and suggest improvements"`,

  exampleDatabase: `# Connect to a PostgreSQL database

# Claude Code
claude mcp add --transport stdio db \\
  -- npx -y @bytebase/dbhub \\
  --dsn "postgresql://readonly:pass@localhost:5432/analytics"

# VS Code (.vscode/mcp.json)
{
  "servers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub"],
      "env": {
        "DATABASE_URL": "\${input:db-url}"
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
> "Find customers who haven't purchased in 90 days"`,

  exampleSentry: `# Connect to Sentry for error monitoring

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
> "Which deployment introduced these new errors?"`,

  exampleFilesystem: `# Local filesystem access

# Claude Code
claude mcp add --transport stdio filesystem \\
  -- npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/dir

# VS Code (.vscode/mcp.json)  
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y", 
        "@modelcontextprotocol/server-filesystem",
        "\${workspaceFolder}"
      ]
    }
  }
}

# Now the AI can:
> Read files outside the current workspace
> Search across multiple directories
> Manage files with explicit user approval`,
}
