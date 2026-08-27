#!/usr/bin/env bun
/**
 * Generate llms.txt and llms-full.txt files from site data
 * 
 * Usage: bun .claude/skills/generate-llms/scripts/generate-llms-full.ts
 * 
 * Reads from the page registry (site/src/data/pages.ts) and generates:
 * - site/public/llms.txt (table of contents)
 * - site/public/llms-full.txt (complete content)
 * - site/public/*.md (page-specific markdown files)
 */

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get the project root (assuming script is in .claude/skills/generate-llms/scripts/)
const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '../../../..')
const dataDir = join(projectRoot, 'site/src/data')
const publicDir = join(projectRoot, 'site/public')

// Types
interface PageMeta {
  slug: string
  title: string
  description: string
  features?: string
  dataFile?: string
  mdFile?: string
  partNumber?: number
}

// Dynamic imports for TypeScript data files
async function loadData() {
  const primitives = await import(join(dataDir, 'primitives.ts'))
  const comparison = await import(join(dataDir, 'comparison.ts'))
  const skillsTutorial = await import(join(dataDir, 'skillsTutorial.ts'))
  const skillExamples = await import(join(dataDir, 'skillExamples.ts'))
  const agentsTutorial = await import(join(dataDir, 'agentsTutorial.ts'))
  const hooksTutorial = await import(join(dataDir, 'hooksTutorial.ts'))
  const mcpTutorial = await import(join(dataDir, 'mcpTutorial.ts'))
  const installTutorial = await import(join(dataDir, 'installTutorial.ts'))
  const mcpScopes = await import(join(dataDir, 'mcpScopes.ts'))
  const providerProfiles = await import(join(dataDir, 'providerProfiles.ts'))
  const starterExamples = await import(join(dataDir, 'starterExamples.ts'))
  const pagesRegistry = await import(join(dataDir, 'pages.ts'))
  
  return {
    // Page registry
    pages: pagesRegistry.pages as readonly PageMeta[],
    // Primitives & comparison (homepage)
    primitives: primitives.primitives,
    categories: primitives.categories,
    scopeModel: primitives.scopeModel,
    comparisonData: comparison.comparisonData,
    // Skills tutorial
    tutorialSections: skillsTutorial.tutorialSections,
    skillExamples: skillExamples.skillExamples,
    // Agents tutorial
    agentsTocItems: agentsTutorial.tocItems,
    agentsCodeSamples: agentsTutorial.codeSamples,
    agentsFurtherReadingLinks: agentsTutorial.furtherReadingLinks,
    // Hooks tutorial
    hooksTocItems: hooksTutorial.tocItems,
    hooksCodeSamples: hooksTutorial.codeSamples,
    hooksFurtherReadingLinks: hooksTutorial.furtherReadingLinks,
    hooksNormalizedEvents: hooksTutorial.normalizedEvents,
    hooksProviderPanels: hooksTutorial.providerPanels,
    // MCP tutorial
    mcpTocItems: mcpTutorial.tocItems,
    mcpCodeSamples: mcpTutorial.codeSamples,
    mcpFurtherReadingLinks: mcpTutorial.furtherReadingLinks,
    mcpScopeProfiles: mcpScopes.mcpScopeProfiles,
    installTocItems: installTutorial.tocItems,
    installLayers: installTutorial.installLayers,
    installUnits: installTutorial.installUnits,
    nativeInstallProfiles: installTutorial.nativeInstallProfiles,
    trustItems: installTutorial.trustItems,
    lifecycleSteps: installTutorial.lifecycleSteps,
    installPaths: installTutorial.installPaths,
    installCodeSamples: installTutorial.codeSamples,
    installFurtherReadingLinks: installTutorial.furtherReadingLinks,
    instructionStarterExamples: starterExamples.instructionStarterExamples,
    skillStarterExamples: starterExamples.skillStarterExamples,
    mcpStarterExamples: starterExamples.mcpStarterExamples,
    // Provider profiles
    providerProfiles: providerProfiles.providerProfiles,
  }
}

function markdownCell(value: string): string {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function withoutTopMatter(content: string): string {
  return content.replace(/^# [^\n]+\n+/, '')
}

function generateLlmsTxt(pages: readonly PageMeta[], primitiveCount: number): string {
  // Generate pages list
  const pagesList = [
    '- [Homepage](https://agentconfig.org/): AI primitives reference, interactive file tree, provider comparison matrix',
    ...pages.map(p => `- [${p.title}](https://agentconfig.org/${p.slug}): ${p.description}`)
  ].join('\n')

  // Generate docs list
  const docsList = [
    '- [Full site content](/llms-full.txt): Complete content for deep context (recommended for agents)',
    ...pages.filter(p => p.mdFile).map(p => `- [${p.title} content](/${p.mdFile}): ${p.features || p.description}`)
  ].join('\n')

  return `# agentconfig.org

> A reference site for configuring AI coding assistants like GitHub Copilot, Claude Code, Cursor, and OpenAI Codex.
> Covers ${primitiveCount} AI primitives, a scope model, provider comparison, config file locations, and tutorials for
> skills, agent instructions, lifecycle hooks, and MCP tool integrations.

This file provides a table of contents. For complete content, see /llms-full.txt.

## Pages

${pagesList}

## Docs

${docsList}

## Optional

- [agentskills.io specification](https://agentskills.io/specification): The skills format specification
- [AGENTS.md specification](https://agents.md): Open format for guiding coding agents
- [MCP specification](https://modelcontextprotocol.io/specification/latest): Model Context Protocol specification
- [Claude Code memory docs](https://code.claude.com/docs/en/memory): Official CLAUDE.md documentation
- [Copilot repository instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions): GitHub Copilot instruction-file documentation
`
}

function generateSkillsMd(data: Awaited<ReturnType<typeof loadData>>): string {
  const { tutorialSections, skillExamples, skillStarterExamples, providerProfiles } = data
  const skillLocations = providerProfiles.map((profile: any) => {
    const entry = profile.categories.flatMap((category: any) => category.entries).find((candidate: any) => candidate.id === 'skills')
    return `| ${profile.name} | ${markdownCell(entry?.location ?? 'Not documented')} | ${entry?.sourceUrl != null ? `[Provider documentation](${entry.sourceUrl})` : '—'} |`
  }).join('\n')
  
  let content = `# Skills Tutorial

Tutorial for creating agent skills following the agentskills.io specification.
Covers progressive disclosure, composability, and includes 5 example skills
from minimal to sophisticated.

## Tutorial Sections

1. Create One Small Skill
${tutorialSections.map((section: any, index: number) => `${index + 2}. ${section.title}`).join('\n')}

## Section Details

### 1. Create One Small Skill

Start with one focused job and an explicit trigger:

\`\`\`markdown
${skillStarterExamples.copilot.code}
\`\`\`

| Provider | Documented location | Source |
|----------|---------------------|--------|
${skillLocations}

`

  for (const [index, section] of tutorialSections.entries()) {
    content += `### ${index + 2}. ${section.title}

${section.description}

${section.content}

---

`
  }

  content += `## Example Skills

Five example skills demonstrating different complexity levels and patterns:

`

  for (const example of skillExamples) {
    content += `### ${example.displayName}

**Complexity:** ${example.complexity}
**Demonstrates:** ${example.demonstrates}

${example.description}

`
    
    for (const file of example.files) {
      content += `**${file.path}:**
\`\`\`${file.language || 'markdown'}
${file.content}
\`\`\`

`
    }

    content += `**Key Takeaways:**
${example.keyTakeaways.map(t => `- ${t}`).join('\n')}

---

`
  }

  return content
}

function generateAgentsMd(data: Awaited<ReturnType<typeof loadData>>): string {
  const {
    agentsTocItems: tocItems,
    agentsCodeSamples: codeSamples,
    agentsFurtherReadingLinks: furtherReadingLinks,
    instructionStarterExamples,
    providerProfiles,
  } = data
  const instructionRows = providerProfiles.map((profile: any) => {
    const entry = profile.categories.flatMap((category: any) => category.entries).find((candidate: any) => candidate.id === 'persistent-instructions')
    return `| ${profile.name} | ${markdownCell(entry?.implementation ?? 'Not documented')} | ${markdownCell(entry?.location ?? 'Not documented')} | ${entry?.sourceUrl != null ? `[Provider documentation](${entry.sourceUrl})` : '—'} |`
  }).join('\n')
  const globalInstructionRows = providerProfiles.map((profile: any) => {
    const entry = profile.categories.flatMap((category: any) => category.entries).find((candidate: any) => candidate.id === 'global-instructions')
    return `| ${profile.name} | ${markdownCell(entry?.implementation ?? 'Not documented')} | ${markdownCell(entry?.location ?? 'Not documented')} | ${entry?.sourceUrl != null ? `[Provider documentation](${entry.sourceUrl})` : '—'} |`
  }).join('\n')
  
  let content = `# Agent Instructions

Start with one useful project instruction file, then add provider-specific formats,
path-scoped rules, agent personas, file hierarchy, and monorepo strategies as needed.

## Tutorial Sections

${tocItems.map(item => `- ${item.label}${item.level ? ` (${item.level})` : ''}`).join('\n')}

## Section Details

### 1. Create One Useful Instruction File

Give your agent the commands and conventions it needs for the repository:

\`\`\`markdown
${instructionStarterExamples.copilot.code}
\`\`\`

| Provider | Implementation | Documented location | Source |
|----------|----------------|---------------------|--------|
${instructionRows}

### 2. What Agent Instructions Do

Agent instructions are markdown files that teach AI coding assistants about your project.
They provide context about how to build, what conventions to follow, and where things live.

**Why Markdown?**
- Human readable: Team members can review and update easily
- Version controlled: Instructions evolve with your codebase
- Tool agnostic: Many AI tools read compatible formats
- No application runtime dependency: Instructions are documentation consumed by supporting agents

### 3. The Six Sections That Matter

[GitHub's analysis of more than 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) found that effective agent instructions cover:

1. **Commands**: Build, test, lint with full flags
2. **Testing**: Framework, locations, how to run
3. **Project Structure**: Key directories mapped
4. **Code Style**: Actual code examples, not descriptions
5. **Git Workflow**: Branch naming, commit format, PR process
6. **Boundaries**: What the AI should NOT do

\`\`\`markdown
${codeSamples.sixSections}
\`\`\`

### 4. Add Your User Preferences

Keep personal preferences separate from the project instructions shared with your team.

| Provider | Implementation | Documented location | Source |
|----------|----------------|---------------------|--------|
${globalInstructionRows}

**Recommendation:** If your assistants support \`AGENTS.md\`, start there for shared team instructions.
Add provider-specific files only when you need unique capabilities such as Claude imports,
Copilot agents, or dedicated path-scoped rule formats.

### 5. Path-Scoped Rules

Claude (.claude/rules/api.md):
\`\`\`markdown
${codeSamples.claudeRules}
\`\`\`

Copilot (.github/instructions/api.instructions.md):
\`\`\`markdown
${codeSamples.copilotPathRules}
\`\`\`

### 6. Agent Personas (Copilot)

\`\`\`markdown
${codeSamples.agentPersona}
\`\`\`

### 7. File Hierarchy & Precedence

A common usage pattern is hierarchical AGENTS.md: keep broad repo defaults at the root, then add
nested AGENTS.md files in high-variance subtrees where ownership, build flows, or risk boundaries
diverge. Providers that support this walk from the root toward the current file, but how they
reconcile broad and specific files varies: some concatenate every applicable file into context
(broadest first), while others give the nearest file precedence. Check each provider's own
precedence rules below rather than assuming one universal merge order.

**Claude Code:**
\`\`\`
${codeSamples.claudeHierarchy}
\`\`\`

**GitHub Copilot:**
\`\`\`
${codeSamples.copilotHierarchy}
\`\`\`

### 8. Monorepo Strategies

\`\`\`
${codeSamples.monorepoStructure}
\`\`\`

Root AGENTS.md:
\`\`\`markdown
${codeSamples.monorepoRoot}
\`\`\`

Package-specific:
\`\`\`markdown
${codeSamples.monorepoPackage}
\`\`\`

## Further Reading

${furtherReadingLinks.map(link => `- [${link.title}](${link.url}): ${link.description}`).join('\n')}
`

  return content
}

function generateMcpMd(data: Awaited<ReturnType<typeof loadData>>): string {
  const { mcpTocItems, mcpCodeSamples, mcpFurtherReadingLinks, mcpStarterExamples, mcpScopeProfiles, providerProfiles } = data
  const mcpRows = providerProfiles.map((profile: any) => {
    const entry = profile.categories.flatMap((category: any) => category.entries).find((candidate: any) => candidate.id === 'tool-integrations')
    return `| ${profile.name} | ${markdownCell(entry?.implementation ?? 'Not documented')} | ${markdownCell(entry?.location ?? 'Not documented')} | ${entry?.support ?? 'none'} | ${entry?.sourceUrl != null ? `[Provider documentation](${entry.sourceUrl})` : '—'} |`
  }).join('\n')
  const providerNames = Object.fromEntries(providerProfiles.map((profile: any) => [profile.provider, profile.name]))
  const starterBlocks = Object.entries(mcpStarterExamples).map(([provider, example]: [string, any]) => `**${providerNames[provider] ?? provider} — \`${example.filename}\`:**

\`\`\`${example.language}
${example.code}
\`\`\``).join('\n\n')
  const scopeBlocks = mcpScopeProfiles.map((profile: any) => `**${profile.label}:**

| Scope | Location | Visibility |
|-------|----------|------------|
${profile.scopes.map((scope: any) => `| ${markdownCell(scope.scope)} | \`${markdownCell(scope.location)}\` | ${markdownCell(scope.visibility)} |`).join('\n')}

${profile.sourceUrl != null ? `[Official ${profile.label} documentation](${profile.sourceUrl})` : ''}`).join('\n\n')
  
  let content = `# MCP Tool Integrations Tutorial

Tutorial for connecting AI coding assistants to external tools using the Model Context Protocol (MCP).
Covers a first server connection, core primitives, installation, configuration scopes, provider details, and security.

## Tutorial Sections

${mcpTocItems.map((item: any) => `- ${item.label}${item.level ? ` (${item.level})` : ''}`).join('\n')}

## Section Details

### 1. Connect One Server

Start with the GitHub MCP server and confirm a read-only operation such as listing pull requests:

${starterBlocks}

### 2. What is MCP?

The Model Context Protocol (MCP) is an open standard that connects AI applications
to external tools, databases, and APIs. Think of it like a USB-C port for AI—one
standardized interface that works across different tools.

\`\`\`
${mcpCodeSamples.mcpConcept}
\`\`\`

MCP follows a client-server architecture:

\`\`\`
${mcpCodeSamples.mcpArchitecture}
\`\`\`

### 3. Why MCP Matters

With MCP servers connected, AI assistants can:
- Query databases naturally
- Manage GitHub issues and PRs
- Analyze monitoring data from Sentry
- Access files outside the current workspace

### 4. Core Primitives

MCP servers expose three types of capabilities:

**Tools** - Executable functions the AI can invoke:
\`\`\`json
${mcpCodeSamples.toolPrimitive}
\`\`\`

**Resources** - Contextual data the AI can read:
\`\`\`json
${mcpCodeSamples.resourcePrimitive}
\`\`\`

**Prompts** - Reusable templates for interactions:
\`\`\`json
${mcpCodeSamples.promptPrimitive}
\`\`\`

### 5. Installing MCP Servers

Providers support different combinations of local and remote transports and use different
configuration methods. Add the server with the documented file or command, then restart or
reload the provider if it does not discover the server immediately.

${starterBlocks}

### 6. Configuration Scopes

MCP servers can be configured at different levels—personal, project, or organization-wide.

${scopeBlocks}

### 7. Check Your Provider Details

| Provider | Implementation | Documented location | Support | Source |
|----------|----------------|---------------------|---------|--------|
${mcpRows}

### 8. Security Considerations

\`\`\`
${mcpCodeSamples.securityTrust}
\`\`\`

Enterprise management with allowlists:
\`\`\`json
${mcpCodeSamples.allowDenyLists}
\`\`\`

### 9. Practical Examples

**GitHub Integration:**
\`\`\`bash
${mcpCodeSamples.exampleGitHub}
\`\`\`

**Database Queries:**
\`\`\`bash
${mcpCodeSamples.exampleDatabase}
\`\`\`

**Error Monitoring (Sentry):**
\`\`\`bash
${mcpCodeSamples.exampleSentry}
\`\`\`

### 10. Further Reading

${mcpFurtherReadingLinks.map((link: any) => `- [${link.title}](${link.url}): ${link.description}`).join('\n')}
`

  return content
}

function generateProfilesMd(data: Awaited<ReturnType<typeof loadData>>): string {
  const { providerProfiles } = data

  let content = `# Provider Profiles

Per-provider view of every primitive tracked on agentconfig.org: support level, implementation,
file location, and a citation to the provider's own documentation where one exists. Generated
directly from the same typed model that powers the homepage comparison table, so the two views
can never drift apart.

`

  for (const profile of providerProfiles) {
    content += `## ${profile.name}\n\n`
    content += `Coverage: ${profile.coverage.total} primitives tracked — ${profile.coverage.full} full, ${profile.coverage.partial} partial, ${profile.coverage.diy} DIY/manual. ${profile.coverage.cited} of ${profile.coverage.total} cited to provider documentation.\n\n`

    for (const category of profile.categories) {
      content += `### ${category.name}\n\n`
      content += `| Primitive | Support | Implementation | Location | Source |\n`
      content += `|-----------|---------|-----------------|----------|--------|\n`
      for (const entry of category.entries) {
        const source = entry.sourceUrl != null ? `[Provider documentation](${entry.sourceUrl})` : '—'
        content += `| ${entry.name} | ${entry.support} | ${entry.implementation} | \`${entry.location}\` | ${source} |\n`
      }
      content += '\n'
    }
  }

  return content
}

function generateInstallMd(data: Awaited<ReturnType<typeof loadData>>): string {
  const {
    installTocItems,
    installLayers,
    installUnits,
    nativeInstallProfiles,
    trustItems,
    lifecycleSteps,
    installPaths,
    installCodeSamples,
    installFurtherReadingLinks,
  } = data

  const providerNames: Record<string, string> = {
    copilot: 'GitHub Copilot',
    claude: 'Claude Code',
    cursor: 'Cursor',
    codex: 'OpenAI Codex',
  }

  return `# Packaging, Installing, and Sharing Agent Configuration

Use the smallest install unit that solves the problem, review executable and network-capable components before installing them, and keep enough version and provenance information to update or remove the configuration safely.

## Guide Sections

${installTocItems.map((item: any) => `- ${item.label}`).join('\n')}

## 1. Install One Reviewed Package

Before running an installer, open the source, inspect the package contents, identify scripts, hooks, MCP executables, and remote endpoints, then confirm the destination and scope.

\`\`\`bash
${installCodeSamples.reviewChecklist}
\`\`\`

## 2. Understand the Layers

| Layer | Job | Examples |
|-------|-----|----------|
${installLayers.map((layer: any) => `| ${markdownCell(layer.name)} | ${markdownCell(layer.job)} | ${markdownCell(layer.examples)} |`).join('\n')}

## 3. Choose the Smallest Install Unit

| Need | Install unit | Why |
|------|--------------|-----|
${installUnits.map((row: any) => `| ${markdownCell(row.need)} | ${markdownCell(row.choose)} | ${markdownCell(row.reason)} |`).join('\n')}

## 4. Package Portable Components

Agent Plugins 1.0 defines a root \`plugin.json\`, portable skills under \`skills/\`, and portable MCP configuration in \`mcp.json\`. Client-specific components belong in reverse-domain namespaces rather than being mistaken for portable core behavior.

\`\`\`text
${installCodeSamples.pluginLayout}
\`\`\`

## 5. Use Native Provider Installation

${nativeInstallProfiles.map((panel: any) => `### ${providerNames[panel.id] ?? panel.label}

${panel.summary}

\`\`\`${panel.language}
${panel.code}
\`\`\`

[Primary documentation](${panel.sourceUrl})`).join('\n\n')}

## 6. Make Project Setup Reproducible with APM

APM resolves dependencies, writes \`apm.lock.yaml\`, deploys configuration to supported targets, and provides integrity and policy checks. It manages the installation plane; the provider runtime still controls permissions, sandboxing, tool approval, and model behavior.

\`\`\`yaml
${installCodeSamples.apmManifest}
\`\`\`

\`\`\`bash
${installCodeSamples.apmCommands}
\`\`\`

## 7. Choose Installation Scope

| Scope | Use it for | Commit? |
|-------|------------|---------|
| User | Personal tools and workflows used across projects | No credentials or machine-specific values |
| Repository | Shared packages every contributor should be able to restore | Commit reviewed manifests, lockfiles, or settings |
| Local repository | Machine-specific or experimental configuration | No |
| Organization or managed | Approved marketplaces, required plugins, allowlists, policy, and governed defaults | Commit only the organization-approved declaration |

## 8. Review Trust and Provenance

${trustItems.map((item: string) => `- ${item}`).join('\n')}

## 9. Manage the Lifecycle

${lifecycleSteps.map(([step, description]: readonly [string, string], index: number) => `${index + 1}. **${step}:** ${description}`).join('\n')}

## 10. Choose an Installation Path

| Path | Best for | Watch for |
|------|----------|-----------|
${installPaths.map((row: any) => `| ${markdownCell(row.path)} | ${markdownCell(row.useWhen)} | ${markdownCell(row.tradeoff)} |`).join('\n')}

## 11. Further Reading

${installFurtherReadingLinks.map((source: any) => `- [${source.title}](${source.url}): ${source.description}`).join('\n')}
`
}

function generateHooksMd(data: Awaited<ReturnType<typeof loadData>>): string {
  const {
    hooksTocItems,
    hooksCodeSamples,
    hooksFurtherReadingLinks,
    hooksNormalizedEvents,
    hooksProviderPanels,
  } = data

  let content = `# Hooks Tutorial

Tutorial for designing, testing, and mapping lifecycle hooks across provider runtimes.
Starts with a small working hook, then covers provider setup, reusable policy logic,
safety guidance, and fixture-driven tests.

## Tutorial Sections

${hooksTocItems.map((item: any) => `- ${item.label}${item.level ? ` (${item.level})` : ''}`).join('\n')}

## Section Details

### 1. Block One Risky Command

Start with a repository hook that blocks \`git push\`. It is deliberately small, easy to
test, and easy to remove. Pick the provider you use, then connect its config file to a small
adapter.

**Copilot** — repository hooks live under \`.github/hooks/\`.

\`\`\`json
${hooksCodeSamples.copilotHook}
\`\`\`

\`\`\`javascript
${hooksCodeSamples.copilotAdapter}
\`\`\`

**Claude** — shared project hooks live in \`.claude/settings.json\`.

\`\`\`json
${hooksCodeSamples.claudeHook}
\`\`\`

\`\`\`javascript
${hooksCodeSamples.claudeAdapter}
\`\`\`

**Cursor** — repository hooks live in \`.cursor/hooks.json\`.

\`\`\`json
${hooksCodeSamples.cursorHook}
\`\`\`

\`\`\`javascript
${hooksCodeSamples.cursorAdapter}
\`\`\`

**Codex** — repository hooks live in \`.codex/hooks.json\`.

\`\`\`json
${hooksCodeSamples.codexHook}
\`\`\`

\`\`\`javascript
${hooksCodeSamples.codexAdapter}
\`\`\`

### 2. When Hooks Fit

Hooks are deterministic code that runs at defined points in an agent session. Use hooks
when you need machine-enforced policy, repeatable side effects, compact progress updates,
or runtime gates around tool calls. Use instructions for judgment guidance, skills for
human-invoked procedures, and MCP when the agent needs a new tool.

Hooks work well for:
- Gate risky commands such as force-push, production deploys, secret reads, and destructive migrations.
- Publish compact progress only when objective, phase, blocker, or attention changes.
- Preserve continuity before compaction and recover it at session start.
- Keep local audit trails for tool decisions without exposing private data externally.

### 3. Lifecycle Events

Lifecycle events are checkpoints where a hook can observe, allow, block, or record what
happens next. Start with the boundary your policy needs instead of wiring every event.

A typical session moves through:
1. **Begin** — Session start
2. **Ask** — User prompt submitted
3. **Act** — Before tool use, then after tool use or tool failure
4. **Preserve** — Compaction when the runtime condenses context
5. **Finish** — Agent stop

Normalize that intent first, then translate it into each provider's event name:

| Policy boundary | Use it for | GitHub Copilot | Claude Code | Cursor | OpenAI Codex |
| --- | --- | --- | --- | --- | --- |
${hooksNormalizedEvents.map((event: any) => `| ${event.normalized} | ${event.purpose} | ${event.copilot} | ${event.claude} | ${event.cursor} | ${event.codex} |`).join('\n')}

### 4. Hook Contracts

A durable hook contract has four parts: JSON input, structured output, an exit-code policy,
and diagnostics. Keep human-readable logs separate from the final machine-readable decision.

**Normalized payload:**
\`\`\`json
${hooksCodeSamples.normalizedPayload}
\`\`\`

**Decision payload:**
\`\`\`json
${hooksCodeSamples.hookDecision}
\`\`\`

### 5. Providers

Compare hook lifecycle events, config locations, and contracts across Copilot, Claude Code,
Cursor, and Codex.

${hooksProviderPanels.map((panel: any) => `#### ${panel.label}

**Scope:** ${panel.scope}

**Locations:** ${panel.locations.map((location: string) => `\`${location}\``).join(', ')}

**Events:** ${panel.events.map((event: string) => `\`${event}\``).join(', ')}

**Contract:** ${panel.contract}

${panel.notes.map((note: string) => `- ${note}`).join('\n')}

Source: [${panel.sourceTitle}](${panel.sourceUrl})
`).join('\n')}

### 6. Reuse Policy Logic

Once the first hook works, move the repeated command check into a pure policy core and keep
provider adapters thin. The shared \`hooks/policy-core.mjs\` module takes normalized input and
returns a deterministic decision. Provider adapters own I/O, schema translation, exit codes,
and provider-specific response formats.

\`\`\`typescript
${hooksCodeSamples.policyCore}
\`\`\`

### 7. Keep Integrations Safe

Hooks often sit next to shell commands, secrets, and external systems, so they need stricter
defaults than ordinary scripts.

- Shell injection: pass arguments as arrays and avoid shell interpolation for untrusted input.
- Shell parsing: do not infer force-push arguments from raw shell text. The example policy blocks every detected git push; use a real shell parser or server-side branch protection when normal pushes must remain available.
- Secrets: never echo tokens, never put credentials in hook config, and redact environment-derived values from diagnostics.
- Untrusted content: treat retrieved documents, tool output, and user prompts as data, not hook instructions.
- Data egress: fail closed before sending repository, user, or customer data externally unless policy allows it.
- Unavailable services: fail open for optional telemetry, fail closed for policy gates, and test both choices.
- Copilot timeouts: command hook timeouts are always fail-open, even for preToolUse and administrator policy hooks; use small timeouts and make policy-critical checks fast.

\`\`\`typescript
${hooksCodeSamples.safeShell}
\`\`\`

### 8. Test the Hook

Every example hook should have a fixture test and a host-level smoke test.

**Fixture test:**
\`\`\`typescript
${hooksCodeSamples.fixtureTest}
\`\`\`

**Smoke test:**
\`\`\`bash
${hooksCodeSamples.smokeTest}
\`\`\`

### 9. Use Another Primitive

A hook should enforce runtime behavior. Pick the simpler primitive when the agent needs guidance,
a reusable procedure, or a new tool:

- **Instructions for judgment:** Put coding conventions, review guidance, and repository context in AGENTS.md, CLAUDE.md, or another instruction file.
- **A skill for a procedure:** Package a repeatable workflow as a skill or slash command when a person or agent should choose when it runs.
- **MCP for a new tool:** Connect an MCP server when the agent needs structured access to an API, database, or external system.
- **A hook for enforcement:** Keep the hook when the check must run at a lifecycle boundary even if the model forgets or chooses another path.

Hook traps:

- Do not call slow external systems on every tool invocation; batch, throttle, or move that work to session boundaries.
- Do not silently rewrite user intent. Block with a clear message instead.
- Do not make hooks the only copy of business-critical policy. Keep the policy documented and reviewable.

## Further Reading

${hooksFurtherReadingLinks.map((link: any) => `- [${link.title}](${link.url}): ${link.description}`).join('\n')}
`

  return content
}

function generateLlmsFullTxt(data: Awaited<ReturnType<typeof loadData>>): string {
  const { primitives, categories, scopeModel, comparisonData, pages } = data

  // Build list of topics from registry
  const topicsList = pages.map(p => `- ${p.title}`).join('\n')

  // Layers to document, in display order, excluding the synthetic "all" filter tab
  const layers = categories.filter((c: { id: string }) => c.id !== 'all')

  let content = `# agentconfig.org - Complete Site Content

> This file contains the complete content of agentconfig.org for AI agents.
> It includes all AI primitives, the scope model, provider comparisons, config file locations,
> and tutorials for skills, agent instructions, lifecycle hooks, and MCP tool integrations.

## Site Overview

agentconfig.org is a reference site for configuring AI coding assistants like GitHub Copilot,
Claude Code, Cursor, and OpenAI Codex. The site helps developers understand and implement AI
configuration primitives to get consistent, high-quality assistance from AI tools.

**Key Topics:**
- ${primitives.length} AI primitives for configuring agent behavior, organized into ${layers.length} layers
- A nine-entry scope model describing where each primitive applies (managed/org through tool invocation)
- Provider comparison (GitHub Copilot, Claude Code, Cursor, OpenAI Codex)
- Config file locations and hierarchy
${topicsList}

---

# Part 1: AI Primitives

The site documents ${primitives.length} AI primitives organized into ${layers.length} layers:
${layers.map((l: { name: string }) => `- **${l.name}**`).join('\n')}

Scopes (managed/org, user, repository, local repository, directory/path, agent, session, turn,
tool invocation) describe *where* a primitive applies. They are not primitives themselves — see
the Choose the Right Scope section after the provider comparison.

`

  for (const layer of layers) {
    const layerPrimitives = primitives.filter((p: { category: string }) => p.category === layer.id)

    content += `## ${layer.name}

`

    if (layerPrimitives.length === 0) {
      content += `_No primitives are modeled in this layer yet. It is reserved for future primitives with genuinely distinct semantics for this layer._

`
      continue
    }

    for (const p of layerPrimitives) {
      content += formatPrimitive(p)
    }
  }

  content += `---

# Part 2: Provider Comparison

Support matrix comparing GitHub Copilot, Claude Code, Cursor, and OpenAI Codex:

| Primitive | Copilot | Claude | Cursor | Codex |
|-----------|---------|--------|--------|-------|
`

  for (const row of comparisonData) {
    const copilotIcon = row.copilot.level === 'full' ? '✓' : row.copilot.level === 'partial' ? '◐' : '—'
    const claudeIcon = row.claude.level === 'full' ? '✓' : row.claude.level === 'partial' ? '◐' : '—'
    const cursorIcon = row.cursor.level === 'full' ? '✓' : row.cursor.level === 'partial' ? '◐' : '—'
    const codexIcon = row.codex.level === 'full' ? '✓' : row.codex.level === 'partial' ? '◐' : '—'
    content += `| ${row.primitiveName} | ${copilotIcon} ${row.copilot.implementation} | ${claudeIcon} ${row.claude.implementation} | ${cursorIcon} ${row.cursor.implementation} | ${codexIcon} ${row.codex.implementation} |\n`
  }

  content += `
### Config File Locations

`

  const providerLabels: Record<string, string> = {
    copilot: 'GitHub Copilot',
    claude: 'Claude Code',
    cursor: 'Cursor',
    codex: 'OpenAI Codex',
  }

  for (const [providerId, providerLabel] of Object.entries(providerLabels)) {
    content += `**${providerLabel}:**\n`
    for (const p of primitives) {
      const impl = p.implementations.find((i: { provider: string }) => i.provider === providerId)
      const location = impl ? impl.location : 'Not documented'
      content += `- ${p.name}: \`${location}\`\n`
    }
    content += '\n'
  }

  content += `---

# Part 3: Choose the Right Scope

Once you know which primitive you need, decide where its configuration should live and take
effect. Scopes describe *where* configuration applies, not a new kind of primitive.

| Scope | Applies to | Common usage | Example location |
|-------|------------|--------------|------------------|
${scopeModel.map((s: { name: string; audience: string; example: string; location?: string }) => `| ${s.name} | ${s.audience} | ${s.example} | ${s.location != null ? `\`${s.location}\`` : '—'} |`).join('\n')}

`

  content += `---

# Part ${pages.find(p => p.slug === 'skills')?.partNumber ?? 4}: Skills Tutorial
`

  content += withoutTopMatter(generateSkillsMd(data))

  content += `
---

# Part ${pages.find(p => p.slug === 'agents')?.partNumber ?? 5}: Agent Instructions

`

  content += withoutTopMatter(generateAgentsMd(data))

  content += `
---

# Part ${pages.find(p => p.slug === 'hooks')?.partNumber ?? 6}: Hooks Tutorial

`

  content += withoutTopMatter(generateHooksMd(data))

  content += `
---

# Part ${pages.find(p => p.slug === 'mcp')?.partNumber ?? 7}: MCP Tool Integrations Tutorial

`

  content += withoutTopMatter(generateMcpMd(data))

  content += `
---

# Part ${pages.find(p => p.slug === 'install')?.partNumber ?? 8}: Install & Share

`

  content += withoutTopMatter(generateInstallMd(data))

  content += `
---

# Part ${pages.find(p => p.slug === 'profiles')?.partNumber ?? 9}: Provider Profiles

`

  content += withoutTopMatter(generateProfilesMd(data))

  return content
}

function formatPrimitive(p: any): string {
  return `### ${p.name}

${p.description}

**What it is:** ${p.whatItIs}

**Use when:**
${p.useWhen.map((u: string) => `- ${u}`).join('\n')}

**Prevents:** ${p.prevents}

**Combine with:** ${p.combineWith.join(', ')}

**Provider Implementations:**

| Provider | Implementation | Location | Support | Source |
|----------|---------------|----------|---------|--------|
${p.implementations.map((impl: any) => {
  const providerName =
    impl.provider === 'copilot' ? 'GitHub Copilot' :
    impl.provider === 'claude' ? 'Claude Code' :
    impl.provider === 'cursor' ? 'Cursor' :
    impl.provider === 'codex' ? 'OpenAI Codex' :
    impl.provider;
  const source = impl.sourceUrl != null ? `[Provider documentation](${impl.sourceUrl})` : '—'
  return `| ${providerName} | ${impl.implementation} | \`${impl.location}\` | ${impl.support} | ${source} |`
}).join('\n')}

---

`
}

async function main() {
  console.log('Loading data files...')
  const data = await loadData()
  
  console.log('Generating llms.txt...')
  const llmsTxt = generateLlmsTxt(data.pages, data.primitives.length)
  writeFileSync(join(publicDir, 'llms.txt'), llmsTxt)
  
  console.log('Generating skills.md...')
  const skillsMd = generateSkillsMd(data)
  writeFileSync(join(publicDir, 'skills.md'), skillsMd)
  
  console.log('Generating agents.md...')
  const agentsMd = generateAgentsMd(data)
  writeFileSync(join(publicDir, 'agents.md'), agentsMd)

  console.log('Generating hooks.md...')
  const hooksMd = generateHooksMd(data)
  writeFileSync(join(publicDir, 'hooks.md'), hooksMd)
  
  console.log('Generating mcp.md...')
  const mcpMd = generateMcpMd(data)
  writeFileSync(join(publicDir, 'mcp.md'), mcpMd)

  console.log('Generating install.md...')
  const installMd = generateInstallMd(data)
  writeFileSync(join(publicDir, 'install.md'), installMd)

  console.log('Generating profiles.md...')
  const profilesMd = generateProfilesMd(data)
  writeFileSync(join(publicDir, 'profiles.md'), profilesMd)

  console.log('Generating llms-full.txt...')
  const llmsFullTxt = generateLlmsFullTxt(data)
  writeFileSync(join(publicDir, 'llms-full.txt'), llmsFullTxt)
  
  console.log('Done! Generated:')
  console.log('  - site/public/llms.txt')
  console.log('  - site/public/llms-full.txt')
  for (const page of data.pages) {
    if (page.mdFile) {
      console.log(`  - site/public/${page.mdFile}`)
    }
  }
}

main().catch(console.error)
