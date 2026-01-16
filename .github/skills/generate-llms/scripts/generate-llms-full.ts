#!/usr/bin/env bun
/**
 * Generate llms.txt and llms-full.txt files from site data
 * 
 * Usage: bun .github/skills/generate-llms/scripts/generate-llms-full.ts
 * 
 * Reads data from site/src/data/*.ts and generates:
 * - site/public/llms.txt (table of contents)
 * - site/public/llms-full.txt (complete content)
 * - site/public/skills/llms.txt (skills page)
 * - site/public/agents/llms.txt (agents page)
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get the project root (assuming script is in .github/skills/generate-llms/scripts/)
const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '../../../..')
const dataDir = join(projectRoot, 'site/src/data')
const publicDir = join(projectRoot, 'site/public')

// Dynamic imports for TypeScript data files
async function loadData() {
  // We need to use tsx or ts-node to import these
  const primitives = await import(join(dataDir, 'primitives.ts'))
  const comparison = await import(join(dataDir, 'comparison.ts'))
  const skillsTutorial = await import(join(dataDir, 'skillsTutorial.ts'))
  const skillExamples = await import(join(dataDir, 'skillExamples.ts'))
  const agentsTutorial = await import(join(dataDir, 'agentsTutorial.ts'))
  
  return {
    primitives: primitives.primitives,
    categories: primitives.categories,
    comparisonData: comparison.comparisonData,
    tutorialSections: skillsTutorial.tutorialSections,
    skillExamples: skillExamples.skillExamples,
    tocItems: agentsTutorial.tocItems,
    codeSamples: agentsTutorial.codeSamples,
    furtherReadingLinks: agentsTutorial.furtherReadingLinks,
  }
}

function generateLlmsTxt(): string {
  return `# agentconfig.org

> A reference site for configuring AI coding assistants like GitHub Copilot and Claude Code.
> Covers 10 AI primitives, provider comparison, config file locations, and tutorials for
> skills and agent definitions.

This file provides a table of contents. For complete content, see /llms-full.txt.

## Pages

- [Homepage](https://agentconfig.org/): AI primitives reference, interactive file tree, provider comparison matrix
- [Skills Tutorial](https://agentconfig.org/skills): How to create agent skills following the agentskills.io specification
- [Agents Tutorial](https://agentconfig.org/agents): Agent definition files (AGENTS.md, CLAUDE.md, copilot-instructions.md)

## Docs

- [Full site content](/llms-full.txt): Complete content for deep context (recommended for agents)
- [Skills page content](/skills.md): Skills tutorial with 5 example skills
- [Agents page content](/agents.md): Agents tutorial with code samples

## Optional

- [agentskills.io specification](https://agentskills.io/specification): The skills format specification
- [AGENTS.md specification](https://agents.md): Open format for guiding coding agents
- [Claude Code Memory docs](https://docs.anthropic.com/en/docs/claude-code/memory): Official CLAUDE.md documentation
- [Copilot customization docs](https://docs.github.com/en/copilot/customizing-copilot): GitHub Copilot instructions documentation
`
}

function generateSkillsMd(data: Awaited<ReturnType<typeof loadData>>): string {
  const { tutorialSections, skillExamples } = data
  
  let content = `# Skills Tutorial

Tutorial for creating agent skills following the agentskills.io specification.
Covers progressive disclosure, composability, and includes 5 example skills
from minimal to sophisticated.

## Tutorial Sections

`

  for (const section of tutorialSections) {
    content += `### ${section.title}

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
  const { tocItems, codeSamples, furtherReadingLinks } = data
  
  let content = `# Agent Definitions Tutorial

Tutorial for creating agent definition files (AGENTS.md, CLAUDE.md, copilot-instructions.md).
Covers provider-specific formats, path-scoped rules, agent personas, file hierarchy,
and monorepo strategies.

## Tutorial Sections

${tocItems.map(item => `- ${item.label}${item.level ? ` (${item.level})` : ''}`).join('\n')}

## Section Details

### 1. What Are Agent Definitions?

Agent definitions are markdown files that teach AI coding assistants about your project.
They provide context about how to build, what conventions to follow, and where things live.

**Why Markdown?**
- Human readable: Team members can review and update easily
- Version controlled: Instructions evolve with your codebase
- Tool agnostic: Many AI tools read the same formats
- No runtime cost: Instructions load at session start

### 2. Your First Agent Definition

Minimal example that works with any AI coding assistant:

\`\`\`markdown
${codeSamples.minimalAgent}
\`\`\`

### 3. The Six Sections That Matter

Analysis of 2,500+ repositories shows effective agent definitions cover:

1. **Commands**: Build, test, lint with full flags
2. **Testing**: Framework, locations, how to run
3. **Project Structure**: Key directories mapped
4. **Code Style**: Actual code examples, not descriptions
5. **Git Workflow**: Branch naming, commit format, PR process
6. **Boundaries**: What the AI should NOT do

\`\`\`markdown
${codeSamples.sixSections}
\`\`\`

### 4. Provider-Specific Formats

**AGENTS.md** (Open standard, 60k+ projects):
\`\`\`markdown
${codeSamples.agentsMdFormat}
\`\`\`

**CLAUDE.md** (Claude Code):
\`\`\`markdown
${codeSamples.claudeMdFormat}
\`\`\`

**copilot-instructions.md** (GitHub Copilot):
\`\`\`markdown
${codeSamples.copilotInstructions}
\`\`\`

| Feature | AGENTS.md | CLAUDE.md | copilot-instructions |
|---------|-----------|-----------|---------------------|
| Location | Project root | Root or .claude/ | .github/ |
| Path rules | ✗ | ✓ .claude/rules/ | ✓ .instructions.md |
| File imports | ✗ | ✓ @file syntax | ✗ |
| Agent personas | ✗ | ✗ | ✓ .agent.md |
| Cross-tool support | Wide | Claude only | Copilot only |

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

function generateLlmsFullTxt(data: Awaited<ReturnType<typeof loadData>>): string {
  const { primitives, comparisonData } = data
  
  let content = `# agentconfig.org - Complete Site Content

> This file contains the complete content of agentconfig.org for AI agents.
> It includes all AI primitives, provider comparisons, config file locations,
> skills tutorial, and agent definitions tutorial.

## Site Overview

agentconfig.org is a reference site for configuring AI coding assistants like GitHub Copilot
and Claude Code. The site helps developers understand and implement AI configuration primitives
to get consistent, high-quality assistance from AI tools.

**Key Topics:**
- 10 AI primitives for configuring agent behavior
- Provider comparison (GitHub Copilot vs Claude Code)
- Config file locations and hierarchy
- Skills tutorial (agentskills.io specification)
- Agent definitions tutorial (AGENTS.md, CLAUDE.md, etc.)

---

# Part 1: AI Primitives

The site documents 10 AI primitives organized into 3 categories:
- **Capability (Execution)**: What the AI can do
- **Customization (Instructions)**: How to shape AI behavior
- **Control (Safety)**: How to constrain AI actions

`

  // Group primitives by category
  const byCategory = {
    execution: primitives.filter(p => p.category === 'execution'),
    instructions: primitives.filter(p => p.category === 'instructions'),
    safety: primitives.filter(p => p.category === 'safety'),
  }

  content += `## Capability Primitives (Execution)

These primitives define what the AI can do.

`

  for (const p of byCategory.execution) {
    content += formatPrimitive(p)
  }

  content += `## Customization Primitives (Instructions)

These primitives shape how the AI behaves.

`

  for (const p of byCategory.instructions) {
    content += formatPrimitive(p)
  }

  content += `## Control Primitives (Safety)

These primitives constrain what the AI is allowed to do.

`

  for (const p of byCategory.safety) {
    content += formatPrimitive(p)
  }

  content += `---

# Part 2: Provider Comparison

Support matrix comparing GitHub Copilot and Claude Code:

| Primitive | Copilot | Claude |
|-----------|---------|--------|
`

  for (const row of comparisonData) {
    const copilotIcon = row.copilot.level === 'full' ? '✓' : row.copilot.level === 'partial' ? '◐' : '—'
    const claudeIcon = row.claude.level === 'full' ? '✓' : row.claude.level === 'partial' ? '◐' : '—'
    content += `| ${row.primitiveName} | ${copilotIcon} ${row.copilot.implementation} | ${claudeIcon} ${row.claude.implementation} |\n`
  }

  content += `
### Config File Locations

**GitHub Copilot:**
- Persistent Instructions: \`.github/copilot-instructions.md\`
- Path-Scoped Rules: \`.github/instructions/*.instructions.md\`
- Slash Commands: \`.github/prompts/*.prompt.md\`
- Custom Agents: \`.github/agents/*.agent.md\`
- Skills: \`.github/skills/*/SKILL.md\`

**Claude Code:**
- Persistent Instructions: \`CLAUDE.md\` (root) or \`.claude/CLAUDE.md\`
- Global Instructions: \`~/.claude/CLAUDE.md\`
- Path-Scoped Rules: \`.claude/rules/*.md\`
- Slash Commands: \`.claude/commands/*.md\`
- Custom Agents: \`.claude/agents/*.md\`
- Skills: \`.claude/skills/*/SKILL.md\`
- Lifecycle Hooks: \`.claude/hooks/hooks.json\`
- MCP Settings: \`.claude/settings.json\`

---

# Part 3: Skills Tutorial

`

  content += generateSkillsMd(data).replace(/^# Skills Tutorial\n\n[^\n]+\n[^\n]+\n[^\n]+\n\n/, '')

  content += `
---

# Part 4: Agent Definitions Tutorial

`

  content += generateAgentsMd(data).replace(/^# Agent Definitions Tutorial\n\n[^\n]+\n[^\n]+\n[^\n]+\n\n/, '')

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

| Provider | Implementation | Location | Support |
|----------|---------------|----------|---------|
${p.implementations.map((impl: any) => 
  `| ${impl.provider === 'copilot' ? 'GitHub Copilot' : 'Claude Code'} | ${impl.implementation} | ${impl.location} | ${impl.support} |`
).join('\n')}

---

`
}

async function main() {
  console.log('Loading data files...')
  const data = await loadData()
  
  console.log('Generating llms.txt...')
  const llmsTxt = generateLlmsTxt()
  writeFileSync(join(publicDir, 'llms.txt'), llmsTxt)
  
  console.log('Generating skills.md...')
  const skillsMd = generateSkillsMd(data)
  writeFileSync(join(publicDir, 'skills.md'), skillsMd)
  
  console.log('Generating agents.md...')
  const agentsMd = generateAgentsMd(data)
  writeFileSync(join(publicDir, 'agents.md'), agentsMd)
  
  console.log('Generating llms-full.txt...')
  const llmsFullTxt = generateLlmsFullTxt(data)
  writeFileSync(join(publicDir, 'llms-full.txt'), llmsFullTxt)
  
  console.log('Done! Generated:')
  console.log('  - site/public/llms.txt')
  console.log('  - site/public/llms-full.txt')
  console.log('  - site/public/skills.md')
  console.log('  - site/public/agents.md')
}

main().catch(console.error)
