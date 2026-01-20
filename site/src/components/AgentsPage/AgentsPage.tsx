import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { CodeBlock } from '@/components/CodeBlock'
import { CodeTabs } from '@/components/CodeBlock/CodeTabs'
import { TableOfContents } from '@/components/TableOfContents'
import { tocItems, furtherReadingLinks, codeSamples } from '@/data/agentsTutorial'

export function AgentsPage(): VNode {
  return (
    <PageLayout llmsPath="/agents.md">
      {/* Hero Section */}
      <header className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Agent Definitions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Learn how to configure AI coding assistants like Claude Code and GitHub Copilot
            with markdown files. From simple project instructions to advanced multi-agent setups.
          </p>
          <div className="flex gap-2 mt-6 flex-wrap">
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Beginner friendly
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Provider comparison
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              Advanced patterns
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
              
              {/* Section 1: What Are Agent Definitions? */}
              <section id="what-are-definitions" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">1. What Are Agent Definitions?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Agent definitions are markdown files that teach AI coding assistants about your project.
                </p>
                
                <p>
                  When you use an AI coding assistant like Claude Code or GitHub Copilot, it needs context
                  about your project—how to build it, what conventions you follow, where things live.
                  Agent definitions provide this context in structured markdown files that the AI reads
                  automatically.
                </p>

                <div className="my-8 p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">Why Markdown?</h3>
                  <ul className="space-y-2">
                    <li><strong>Human readable:</strong> Team members can review and update instructions easily</li>
                    <li><strong>Version controlled:</strong> Instructions evolve with your codebase</li>
                    <li><strong>Tool agnostic:</strong> Many AI tools read the same formats</li>
                    <li><strong>No runtime cost:</strong> Instructions load at session start, not during inference</li>
                  </ul>
                </div>

                <p>
                  The most popular format is <code>AGENTS.md</code>, an open standard used by over 60,000
                  projects and supported by Claude Code, GitHub Copilot, Cursor, Aider, and others. Individual
                  providers also have their own formats with additional features.
                </p>
              </section>

              {/* Section 2: Your First Agent Definition */}
              <section id="first-definition" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">2. Your First Agent Definition</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Start with a single file in your project root. Here's a minimal example that works
                  with any AI coding assistant.
                </p>

                <CodeBlock 
                  code={codeSamples.minimalAgent ?? ''}
                  language="markdown"
                  filename="AGENTS.md"
                  className="my-6"
                />

                <p>
                  That's it! Place this file in your project root and AI assistants will automatically
                  read it. This single file gives the AI the most essential context: how to build,
                  test, and contribute to your project.
                </p>

                <div className="my-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3">💡 Start Simple</h3>
                  <p>
                    Begin with just the commands section. Add more as you notice the AI making mistakes
                    or asking repetitive questions. The best agent definitions evolve organically.
                  </p>
                </div>
              </section>

              {/* Section 3: The Six Sections That Matter */}
              <section id="six-sections" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">3. The Six Sections That Matter</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Analysis of 2,500+ repositories shows that effective agent definitions cover six key areas.
                </p>

                <p>
                  Based on GitHub's analysis of repositories with <code>AGENTS.md</code> files, the most
                  effective definitions include these sections:
                </p>

                <CodeBlock 
                  code={codeSamples.sixSections ?? ''}
                  language="markdown"
                  filename="AGENTS.md"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Section Details</h3>
                <ol className="my-6 space-y-4">
                  <li>
                    <strong>1. Commands:</strong> Include full flags and options. <code>npm test -- --coverage</code>
                    is better than just <code>npm test</code>.
                  </li>
                  <li>
                    <strong>2. Testing:</strong> Specify framework, test file locations, and how to run
                    individual tests vs. the full suite.
                  </li>
                  <li>
                    <strong>3. Project Structure:</strong> Map out key directories so the AI knows where
                    to look for different types of code.
                  </li>
                  <li>
                    <strong>4. Code Style:</strong> Include actual code examples, not just descriptions.
                    Show the AI what good code looks like.
                  </li>
                  <li>
                    <strong>5. Git Workflow:</strong> Branch naming, commit format, PR process—everything
                    the AI needs to make proper commits.
                  </li>
                  <li>
                    <strong>6. Boundaries:</strong> Explicitly state what the AI should NOT do. This
                    prevents costly mistakes.
                  </li>
                </ol>

                <div className="my-8 p-6 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-lg font-semibold mb-3">⚠️ Common Mistake</h3>
                  <p>
                    Don't write vague instructions like "follow best practices." Instead, show specific
                    examples: "Error handling should look like this: <code>if err != nil {'{...}'}</code>"
                  </p>
                </div>
              </section>

              {/* Section 4: Provider-Specific Formats */}
              <section id="provider-formats" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">4. Provider-Specific Formats</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Each AI provider has their own file format with unique features. Here's how they compare.
                </p>

                <CodeTabs
                  files={[
                    {
                      path: 'AGENTS.md',
                      content: codeSamples.agentsMdFormat ?? '',
                      language: 'markdown',
                    },
                    {
                      path: 'CLAUDE.md',
                      content: codeSamples.claudeMdFormat ?? '',
                      language: 'markdown',
                    },
                    {
                      path: '.github/copilot-instructions.md',
                      content: codeSamples.copilotInstructions ?? '',
                      language: 'markdown',
                    },
                  ]}
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Key Differences</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Feature</th>
                        <th className="text-left py-2 pr-4">AGENTS.md</th>
                        <th className="text-left py-2 pr-4">CLAUDE.md</th>
                        <th className="text-left py-2">copilot-instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Location</td>
                        <td className="py-2 pr-4">Project root</td>
                        <td className="py-2 pr-4">Root or .claude/</td>
                        <td className="py-2">.github/</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Path rules</td>
                        <td className="py-2 pr-4">✗</td>
                        <td className="py-2 pr-4">✓ .claude/rules/</td>
                        <td className="py-2">✓ .instructions.md</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">File imports</td>
                        <td className="py-2 pr-4">✗</td>
                        <td className="py-2 pr-4">✓ @file syntax</td>
                        <td className="py-2">✗</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Agent personas</td>
                        <td className="py-2 pr-4">✗</td>
                        <td className="py-2 pr-4">✗</td>
                        <td className="py-2">✓ .agent.md</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Cross-tool support</td>
                        <td className="py-2 pr-4">Wide</td>
                        <td className="py-2 pr-4">Claude only</td>
                        <td className="py-2">Copilot only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="my-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3">💡 Recommendation</h3>
                  <p>
                    Use <code>AGENTS.md</code> for team-wide instructions that should work across tools.
                    Add provider-specific files only when you need their unique features (like path rules
                    or file imports).
                  </p>
                </div>
              </section>

              {/* Section 5: Path-Scoped Rules */}
              <section id="path-scoped" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">5. Path-Scoped Rules</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Apply different instructions to different parts of your codebase.
                </p>

                <p>
                  Large projects need different rules for different areas. Both Claude and Copilot
                  support path-scoped instructions, though with different syntax.
                </p>

                <CodeTabs
                  files={[
                    {
                      path: '.claude/rules/api.md',
                      content: codeSamples.claudeRules ?? '',
                      language: 'markdown',
                    },
                    {
                      path: '.github/instructions/api.instructions.md',
                      content: codeSamples.copilotPathRules ?? '',
                      language: 'markdown',
                    },
                  ]}
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">When to Use Path Rules</h3>
                <ul className="my-6 space-y-3">
                  <li>
                    <strong>Different languages:</strong> TypeScript frontend vs. Go backend need
                    different style guides.
                  </li>
                  <li>
                    <strong>Different domains:</strong> API routes, database models, and UI components
                    have different patterns.
                  </li>
                  <li>
                    <strong>Security boundaries:</strong> Some directories need stricter review or
                    have access restrictions.
                  </li>
                  <li>
                    <strong>Legacy code:</strong> Old code might have different conventions you want
                    to maintain (or explicitly migrate from).
                  </li>
                </ul>
              </section>

              {/* Section 6: Agent Personas */}
              <section id="agent-personas" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">6. Agent Personas (Copilot)</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Create specialized agents with distinct identities and toolsets.
                </p>

                <p>
                  GitHub Copilot supports custom agent personas through <code>.agent.md</code> files.
                  Each agent has its own name, description, and instructions. Users can invoke them
                  with <code>@agent-name</code> in chat.
                </p>

                <CodeBlock 
                  code={codeSamples.agentPersona ?? ''}
                  language="markdown"
                  filename=".github/agents/security-reviewer.agent.md"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Persona Use Cases</h3>
                <ul className="my-6 space-y-3">
                  <li>
                    <strong>Security reviewer:</strong> Specialized knowledge of vulnerabilities, OWASP
                    guidelines, and secure coding patterns.
                  </li>
                  <li>
                    <strong>API designer:</strong> Focus on REST conventions, schema design, and
                    backwards compatibility.
                  </li>
                  <li>
                    <strong>Test writer:</strong> Deep knowledge of testing frameworks, mocking
                    strategies, and coverage requirements.
                  </li>
                  <li>
                    <strong>Documentation helper:</strong> Generates READMEs, API docs, and inline
                    comments following your style.
                  </li>
                </ul>

                <div className="my-8 p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">File Structure</h3>
                  <CodeBlock 
                    code={codeSamples.agentDirectory ?? ''}
                    language="text"
                    filename="Directory layout"
                    className="mt-4"
                  />
                </div>
              </section>

              {/* Section 7: File Hierarchy & Precedence */}
              <section id="file-hierarchy" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">7. File Hierarchy & Precedence</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  When multiple definition files exist, they combine in specific ways.
                </p>

                <p>
                  Both Claude and Copilot read instructions from multiple levels. Understanding
                  the hierarchy helps you put instructions in the right place.
                </p>

                <CodeTabs
                  files={[
                    {
                      path: 'Claude Code precedence',
                      content: codeSamples.claudeHierarchy ?? '',
                      language: 'text',
                    },
                    {
                      path: 'GitHub Copilot precedence',
                      content: codeSamples.copilotHierarchy ?? '',
                      language: 'text',
                    },
                  ]}
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Where to Put What</h3>
                <ul className="my-6 space-y-3">
                  <li>
                    <strong>Personal preferences:</strong> User-level config (shell conventions,
                    editor settings, response style).
                  </li>
                  <li>
                    <strong>Team standards:</strong> Repository root (build commands, code style,
                    git workflow).
                  </li>
                  <li>
                    <strong>Component-specific:</strong> Path rules (API conventions, test patterns,
                    domain logic).
                  </li>
                </ul>

                <div className="my-8 p-6 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-lg font-semibold mb-3">⚠️ Conflict Resolution</h3>
                  <p>
                    When instructions conflict, <strong>more specific wins</strong>. A path-scoped rule
                    overrides a repository-wide rule, which overrides user preferences. Be explicit
                    about intent when you need to override.
                  </p>
                </div>
              </section>

              {/* Section 8: Monorepo Strategies */}
              <section id="monorepo" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">8. Monorepo Strategies</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Patterns for configuring AI assistants in multi-package repositories.
                </p>

                <p>
                  Monorepos present unique challenges: shared tooling, package-specific conventions,
                  and cross-cutting concerns. Here's how to structure your agent definitions.
                </p>

                <CodeBlock 
                  code={codeSamples.monorepoStructure ?? ''}
                  language="text"
                  filename="Monorepo file layout"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Root vs. Package Definitions</h3>
                <CodeTabs
                  files={[
                    {
                      path: 'AGENTS.md',
                      content: codeSamples.monorepoRoot ?? '',
                      language: 'markdown',
                    },
                    {
                      path: 'packages/api/AGENTS.md',
                      content: codeSamples.monorepoPackage ?? '',
                      language: 'markdown',
                    },
                  ]}
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Sharing Rules Across Packages</h3>
                <p>
                  For Claude, you can use symlinks to share rules across packages:
                </p>
                <CodeBlock 
                  code={codeSamples.symlinkSharing ?? ''}
                  language="bash"
                  filename="Setting up shared rules"
                  className="my-6"
                />
              </section>

              {/* Section 9: Further Reading */}
              <section id="further-reading" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">9. Further Reading</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Official documentation and community resources for deeper learning.
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
