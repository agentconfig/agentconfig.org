import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { CodeBlock } from '@/components/CodeBlock'
import { CodeTabs } from '@/components/CodeBlock/CodeTabs'
import { TableOfContents } from '@/components/TableOfContents'
import { tocItems, furtherReadingLinks, codeSamples } from '@/data/mcpTutorial'
import { MCPFeatureTable, ScopesTable } from './tables'

export function MCPPage(): VNode {
  return (
    <PageLayout>
      {/* Hero Section */}
      <header className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            MCP Tool Integrations
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Connect AI coding assistants to external tools, databases, and APIs using
            the Model Context Protocol. One standard interface for unlimited capabilities.
          </p>
          <div className="flex gap-2 mt-6 flex-wrap">
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Beginner friendly
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              Both providers
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              Security focused
            </span>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar - Table of Contents */}
          <aside className="lg:w-[260px] flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <TableOfContents items={tocItems} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              
              {/* Section 1: What is MCP? */}
              <section id="what-is-mcp" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">1. What is MCP?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  The Model Context Protocol (MCP) is an open standard that connects AI applications
                  to external tools, databases, and APIs.
                </p>
                
                <p>
                  Think of MCP like a USB-C port for AI. Just as USB-C provides a standardized way to
                  connect electronic devices, MCP provides a standardized way to connect AI applications
                  to external systems. Without MCP, every AI tool would need custom integrations for every
                  service. With MCP, one protocol connects them all.
                </p>

                <CodeBlock 
                  code={codeSamples.mcpConcept ?? ''}
                  language="text"
                  filename="MCP Concept"
                  className="my-6"
                />

                <p>
                  MCP follows a client-server architecture. The AI application (like Claude Code or VS Code
                  with Copilot) acts as the <strong>MCP Host</strong>, which creates <strong>MCP Clients</strong> to
                  connect to one or more <strong>MCP Servers</strong>. Each server exposes specific capabilities—tools,
                  data sources, and reusable prompts.
                </p>

                <CodeBlock 
                  code={codeSamples.mcpArchitecture ?? ''}
                  language="text"
                  filename="Architecture Overview"
                  className="my-6"
                />

                <div className="my-8 p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">Key Terminology</h3>
                  <ul className="space-y-2">
                    <li><strong>MCP Host:</strong> The AI application that coordinates connections (Claude Code, VS Code)</li>
                    <li><strong>MCP Client:</strong> A component that maintains a connection to one MCP server</li>
                    <li><strong>MCP Server:</strong> A program that provides tools, resources, and prompts</li>
                    <li><strong>Transport:</strong> The communication method (stdio for local, HTTP for remote)</li>
                  </ul>
                </div>
              </section>

              {/* Section 2: Why MCP Matters */}
              <section id="why-mcp-matters" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">2. Why MCP Matters</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  MCP transforms AI assistants from chat interfaces into powerful automation tools.
                </p>

                <p>
                  With MCP servers connected, your AI assistant can perform actions that were previously
                  impossible or required manual intervention:
                </p>

                <ul className="my-6 space-y-3">
                  <li>
                    <strong>Implement features from issue trackers:</strong>{' '}
                    "Add the feature described in JIRA-4521 and create a PR on GitHub."
                  </li>
                  <li>
                    <strong>Query databases naturally:</strong>{' '}
                    "Find users who signed up last month but haven't made a purchase."
                  </li>
                  <li>
                    <strong>Analyze monitoring data:</strong>{' '}
                    "Check Sentry for the most common errors this week and suggest fixes."
                  </li>
                  <li>
                    <strong>Integrate designs:</strong>{' '}
                    "Update our button component based on the new Figma designs."
                  </li>
                  <li>
                    <strong>Automate workflows:</strong>{' '}
                    "Draft emails to users who experienced this bug, apologizing for the issue."
                  </li>
                </ul>

                <div className="my-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3">💡 The Ecosystem Effect</h3>
                  <p>
                    Because MCP is an open standard supported by multiple providers, servers built for one
                    AI assistant often work with others. An MCP server for GitHub works with Claude Code,
                    VS Code + Copilot, Cursor, and more—no modifications needed.
                  </p>
                </div>
              </section>

              {/* Section 3: Core Primitives */}
              <section id="core-primitives" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">3. Core Primitives</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  MCP servers expose three types of capabilities: Tools, Resources, and Prompts.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Tools</h3>
                <p>
                  Tools are executable functions the AI can invoke to perform actions—querying APIs,
                  writing to databases, manipulating files. The AI discovers available tools, decides when
                  to use them, and calls them with appropriate arguments.
                </p>

                <CodeBlock 
                  code={codeSamples.toolPrimitive ?? ''}
                  language="json"
                  filename="Tool Example"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Resources</h3>
                <p>
                  Resources provide contextual data the AI can read—file contents, database schemas,
                  API responses. Unlike tools (which perform actions), resources provide information
                  that enriches the AI's understanding.
                </p>

                <CodeBlock 
                  code={codeSamples.resourcePrimitive ?? ''}
                  language="json"
                  filename="Resource Example"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Prompts</h3>
                <p>
                  Prompts are reusable templates that structure interactions with the AI. They can
                  accept arguments and expand into complete message sequences, enabling consistent
                  workflows across your team.
                </p>

                <CodeBlock 
                  code={codeSamples.promptPrimitive ?? ''}
                  language="json"
                  filename="Prompt Example"
                  className="my-6"
                />

                <div className="my-8 p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">Primitive Summary</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Primitive</th>
                        <th className="text-left py-2 pr-4">Controlled By</th>
                        <th className="text-left py-2">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-medium">Tools</td>
                        <td className="py-2 pr-4">AI Model</td>
                        <td className="py-2">Perform actions</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-medium">Resources</td>
                        <td className="py-2 pr-4">Application</td>
                        <td className="py-2">Provide context</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Prompts</td>
                        <td className="py-2 pr-4">User</td>
                        <td className="py-2">Structure workflows</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 4: Installing MCP Servers */}
              <section id="installing-servers" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">4. Installing MCP Servers</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Both providers support local (stdio) and remote (HTTP) servers, but with different configuration methods.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Claude Code</h3>
                <p>
                  Claude Code uses CLI commands to manage MCP servers. Servers can communicate via
                  HTTP (for remote services) or stdio (for local processes).
                </p>

                <CodeBlock 
                  code={codeSamples.claudeHttpServer ?? ''}
                  language="bash"
                  filename="Remote HTTP Servers"
                  className="my-6"
                />

                <CodeBlock 
                  code={codeSamples.claudeStdioServer ?? ''}
                  language="bash"
                  filename="Local Stdio Servers"
                  className="my-6"
                />

                <CodeBlock 
                  code={codeSamples.claudeManageServers ?? ''}
                  language="bash"
                  filename="Managing Servers"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">VS Code + GitHub Copilot</h3>
                <p>
                  VS Code configures MCP servers through JSON files, with support for input variables
                  to handle sensitive data like API keys.
                </p>

                <CodeBlock 
                  code={codeSamples.vscodeMcpJson ?? ''}
                  language="json"
                  filename=".vscode/mcp.json"
                  className="my-6"
                />

                <div className="my-8 p-6 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-lg font-semibold mb-3">⚠️ Security Note</h3>
                  <p>
                    Never hardcode API keys or credentials directly in configuration files. Use environment
                    variables, input prompts, or env files to handle sensitive data securely.
                  </p>
                </div>
              </section>

              {/* Section 5: Configuration Scopes */}
              <section id="configuration-scopes" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">5. Configuration Scopes</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  MCP servers can be configured at different levels—personal, project, or organization-wide.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Claude Code Scopes</h3>
                <ScopesTable provider="claude" />

                <p>
                  Project-scoped servers are stored in <code>.mcp.json</code> at your project root and can be
                  checked into version control. Claude Code prompts for approval before using project-scoped
                  servers from other contributors.
                </p>

                <CodeBlock 
                  code={codeSamples.projectMcpJson ?? ''}
                  language="json"
                  filename="Project-scoped Configuration"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">VS Code + Copilot Scopes</h3>
                <ScopesTable provider="vscode" />

                <p>
                  VS Code also supports MCP configuration in Dev Containers, ensuring consistent server
                  availability across containerized development environments.
                </p>

                <CodeBlock 
                  code={codeSamples.devcontainerMcp ?? ''}
                  language="json"
                  filename="devcontainer.json"
                  className="my-6"
                />
              </section>

              {/* Section 6: Provider Comparison */}
              <section id="provider-comparison" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">6. Provider Comparison</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Both Claude Code and VS Code + Copilot support MCP, but with different feature sets.
                </p>

                <MCPFeatureTable />

                <h3 className="text-xl font-semibold mt-8 mb-4">Key Differences</h3>
                <ul className="my-6 space-y-3">
                  <li>
                    <strong>Configuration method:</strong> Claude Code uses CLI commands; VS Code uses JSON
                    files and a UI gallery.
                  </li>
                  <li>
                    <strong>Server discovery:</strong> VS Code offers a server gallery and auto-discovery from
                    other apps (like Claude Desktop); Claude Code requires manual configuration.
                  </li>
                  <li>
                    <strong>Tool search:</strong> Claude Code automatically enables tool search when MCP tools
                    exceed 10% of context; VS Code uses a tool picker UI.
                  </li>
                  <li>
                    <strong>Enterprise control:</strong> Both support managed configurations, but with different
                    file locations and formats.
                  </li>
                </ul>

                <div className="my-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3">💡 Cross-Compatibility</h3>
                  <p>
                    MCP servers themselves are cross-compatible—a server built for Claude Code works with
                    VS Code + Copilot. Only the <em>configuration</em> differs between providers.
                  </p>
                </div>
              </section>

              {/* Section 7: Security Considerations */}
              <section id="security-considerations" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">7. Security Considerations</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  MCP servers can execute code and access sensitive data. Understanding the security
                  implications is critical.
                </p>

                <CodeBlock 
                  code={codeSamples.securityTrust ?? ''}
                  language="text"
                  filename="Security Checklist"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Enterprise Management</h3>
                <p>
                  Organizations can deploy managed MCP configurations to control which servers employees
                  can use. This enables standardization while preventing unauthorized access.
                </p>

                <CodeTabs
                  files={[
                    {
                      path: 'managed-mcp.json',
                      content: codeSamples.managedMcp ?? '',
                      language: 'json',
                    },
                    {
                      path: 'allowlist/denylist',
                      content: codeSamples.allowDenyLists ?? '',
                      language: 'json',
                    },
                  ]}
                  className="my-6"
                />

                <div className="my-8 p-6 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-semibold mb-3">🔒 Local vs Remote Servers</h3>
                  <ul className="space-y-2">
                    <li>
                      <strong>Local (stdio) servers</strong> run on your machine and have access to local
                      resources. Only install from trusted sources.
                    </li>
                    <li>
                      <strong>Remote (HTTP) servers</strong> run elsewhere but communicate over the network.
                      Review their privacy policies and data handling practices.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 8: Practical Examples */}
              <section id="practical-examples" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">8. Practical Examples</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Real-world configurations for common MCP use cases.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">GitHub Integration</h3>
                <p>
                  Connect to GitHub to manage issues, PRs, and repositories directly from your AI assistant.
                </p>
                <CodeBlock 
                  code={codeSamples.exampleGitHub ?? ''}
                  language="bash"
                  filename="GitHub MCP Server"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Database Queries</h3>
                <p>
                  Query your database using natural language. The AI translates your questions into SQL.
                </p>
                <CodeBlock 
                  code={codeSamples.exampleDatabase ?? ''}
                  language="bash"
                  filename="Database MCP Server"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Error Monitoring</h3>
                <p>
                  Connect to Sentry to analyze errors, identify patterns, and correlate issues with deployments.
                </p>
                <CodeBlock 
                  code={codeSamples.exampleSentry ?? ''}
                  language="bash"
                  filename="Sentry MCP Server"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Filesystem Access</h3>
                <p>
                  Provide controlled access to files outside the current workspace.
                </p>
                <CodeBlock 
                  code={codeSamples.exampleFilesystem ?? ''}
                  language="bash"
                  filename="Filesystem MCP Server"
                  className="my-6"
                />
              </section>

              {/* Section 9: Further Reading */}
              <section id="further-reading" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">9. Further Reading</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Official documentation, specifications, and community resources.
                </p>

                <div className="grid gap-4">
                  {furtherReadingLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {link.description}
                          </p>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground flex-shrink-0">
                          {link.source}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>

            </article>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
