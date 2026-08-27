import type { VNode } from 'preact'
import { PageLayout } from '@/layouts'
import { CodeBlock } from '@/components/CodeBlock'
import { CodeTabs } from '@/components/CodeBlock/CodeTabs'
import { GuideHero, GuideLayout, ProviderPrimitiveTabs, ProviderStarter } from '@/components/GuidePage'
import { tocItems, furtherReadingLinks, codeSamples } from '@/data/agentsTutorial'
import { instructionStarterExamples } from '@/data/starterExamples'

export function AgentsPage(): VNode {
  return (
    <PageLayout llmsPath="/agents.md">
      <GuideHero
        title="Agent Instructions"
        description="Start with one small project file that teaches your coding agent how to build, test, and work safely. Add provider-specific files and advanced layouts only when the shared instructions are not enough."
        badges={[
          { label: 'One useful file', tone: 'green' },
          { label: 'Provider locations', tone: 'yellow' },
          { label: 'Advanced layouts', tone: 'red' },
        ]}
      />
      <GuideLayout tocItems={tocItems}>
              <ProviderStarter
                id="first-definition"
                title="Create one useful instruction file"
                description="Give your agent the commands and conventions it needs for this repository. This small example is enough to test whether the file is being discovered."
                primitiveId="persistent-instructions"
                examples={instructionStarterExamples}
              />
              
              {/* Section 2: What Agent Instructions Do */}
              <section id="what-are-definitions" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">2. What Agent Instructions Do</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Agent instructions are markdown files that teach AI coding assistants about your project.
                </p>
                
                <p>
                  When you use an AI coding assistant like Claude Code or GitHub Copilot, it needs context
                  about your project—how to build it, what conventions you follow, where things live.
                  Agent instructions provide this context in structured markdown files that the AI reads
                  automatically.
                </p>

                <div className="my-8 p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">Why Markdown?</h3>
                  <ul className="space-y-2">
                    <li><strong>Human readable:</strong> Team members can review and update instructions easily</li>
                    <li><strong>Version controlled:</strong> Instructions evolve with your codebase</li>
                    <li><strong>Tool agnostic:</strong> Many AI tools read the same formats</li>
                    <li><strong>No application runtime dependency:</strong> Instructions are documentation consumed by supporting agents</li>
                  </ul>
                </div>

                <p>
                  The most popular format is <code>AGENTS.md</code>, an open format supported by GitHub
                  Copilot, OpenAI Codex, Cursor, Aider, and other coding agents. Claude Code reads
                  <code>CLAUDE.md</code> rather than <code>AGENTS.md</code> directly, but a small
                  <code>CLAUDE.md</code> can import <code>AGENTS.md</code> so the project keeps one shared
                  source of instructions.
                </p>
              </section>

              {/* Section 3: The Six Sections That Matter */}
              <section id="six-sections" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">3. The Six Sections That Matter</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  A <a href="https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/" target="_blank" rel="noopener noreferrer">GitHub analysis of more than 2,500 repositories</a> found that effective agent instructions cover six key areas.
                </p>

                <p>
                  Based on GitHub's analysis of repositories with <code>AGENTS.md</code> files, the most
                  effective instruction files include these sections:
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

              {/* Section 4: User Scope Instructions */}
              <section id="provider-formats" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-bold mb-4">4. Add Your User Preferences</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Keep personal preferences separate from the project instructions shared with your team.
                </p>

                <ProviderPrimitiveTabs
                  primitiveId="global-instructions"
                  idPrefix="agent-provider-formats"
                  ariaLabel="User instruction provider formats"
                />

                <div className="my-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3">💡 Recommendation</h3>
                  <p>
                    If your assistants support <code>AGENTS.md</code>, start there for shared team instructions.
                    Add provider-specific files only when you need unique capabilities like Claude imports,
                    Copilot agents, or dedicated path-scoped rule formats.
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
                  Large projects need different rules for different areas. The provider profile for
                  your selected tool lists its documented path-scoped instruction format.
                </p>

                <ProviderPrimitiveTabs
                  primitiveId="scope-specific-instructions"
                  idPrefix="agent-path-rules"
                  ariaLabel="Path-scoped instruction provider formats"
                  examples={{
                    copilot: {
                      filename: '.github/instructions/api.instructions.md',
                      language: 'markdown',
                      code: codeSamples.copilotPathRules ?? '',
                    },
                    claude: {
                      filename: '.claude/rules/api.md',
                      language: 'markdown',
                      code: codeSamples.claudeRules ?? '',
                    },
                  }}
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
                  Each agent has its own name, description, instructions, and optional tool restrictions.
                  Users select the agent in a supported Copilot interface.
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
                  When multiple instruction files exist, they combine in specific ways.
                </p>

                <p>
                  Providers read instructions from multiple levels, but combine and prioritize those
                  sources differently. Check the provider documentation before relying on precedence.
                </p>
                <p>
                  A common usage pattern is hierarchical <code>AGENTS.md</code>: keep broad repo defaults
                  at the root, then add nested <code>AGENTS.md</code> files in high-variance subtrees
                  where ownership, build flows, or risk boundaries diverge.
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
                    Avoid conflicting instructions. Claude concatenates applicable instruction files and
                    reads more specific files later. Copilot gives the nearest <code>AGENTS.md</code>
                    precedence among <code>AGENTS.md</code> files, while matching path instructions are
                    additive. Neither model is a substitute for keeping the instruction set consistent.
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
                  and cross-cutting concerns. Here's how to structure your agent instructions.
                </p>

                <CodeBlock 
                  code={codeSamples.monorepoStructure ?? ''}
                  language="text"
                  filename="Monorepo file layout"
                  className="my-6"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">Root vs. Package Instructions</h3>
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

      </GuideLayout>
    </PageLayout>
  )
}
