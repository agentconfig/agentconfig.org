export interface SkillFile {
  readonly path: string
  readonly content: string
  readonly language?: string
}

export interface SkillExampleData {
  readonly id: string
  readonly name: string
  readonly displayName: string
  readonly complexity: 'minimal' | 'low' | 'medium' | 'high'
  readonly description: string
  readonly demonstrates: string
  readonly files: readonly SkillFile[]
  readonly keyTakeaways: readonly string[]
  readonly sourceUrl?: string
}

export const skillExamples: readonly SkillExampleData[] = [
  {
    id: 'who-am-i',
    name: 'who-am-i',
    displayName: 'Who Am I',
    complexity: 'minimal',
    description: 'Identity context skill—pure documentation with no external dependencies.',
    demonstrates: 'Pure documentation skill (~20 lines)',
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        content: `---
name: who-am-i
description: Identity context for the user. Use when writing on their behalf or when context about who they are would help.
---

# Who Am I

## Name
Jonathan Hoyt (jonmagic)

## Role
Principal Engineer at GitHub, Safety & Integrity team

## About
I build systems that protect GitHub's platform from abuse while preserving developer experience. I care deeply about:
- Pragmatic engineering over theoretical perfection
- Clear communication and documentation
- Mentoring and teaching others

## Writing Context
When writing on my behalf, use first-person perspective with a thoughtful, principal-engineer voice.`,
      },
    ],
    keyTakeaways: [
      'Skills can be pure documentation with no code',
      'The description determines when the skill loads',
      'Keep it focused—this skill does one thing well',
    ],
    sourceUrl: 'https://github.com/anthropics/skills',
  },
  {
    id: 'voice-and-tone',
    name: 'voice-and-tone',
    displayName: 'Voice & Tone',
    complexity: 'low',
    description: 'Writing style guide with reference documentation.',
    demonstrates: 'Documentation with references/ for progressive disclosure',
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        content: `---
name: voice-and-tone
description: Writing style guide with authentic voice patterns. Use when generating any prose content—blog posts, documentation, reflections, or feedback.
---

# Voice & Tone

## Core Principles

1. **First-person narratives** with introspective framing
2. **Concrete examples** over abstract concepts
3. **Thoughtful perspective** of a principal engineer

## When Writing

- Start with context, then insight
- Use "I" statements for personal reflection
- Include specific details that ground the writing

For detailed patterns and examples, see \`references/patterns.md\`.`,
      },
      {
        path: 'references/patterns.md',
        language: 'markdown',
        content: `# Voice Patterns

## Opening Lines
Start with context that draws readers in:
- "Last week, our team shipped a feature that..."
- "I've been thinking about how we approach..."
- "There's a pattern I keep seeing in..."

## Transitions
Move between ideas naturally:
- "This connects to something I learned..."
- "The interesting part is..."
- "What surprised me was..."

## Closings
End with reflection or forward-looking thought:
- "Looking back, the key insight was..."
- "Next time, I'll remember to..."
- "This changed how I think about..."`,
      },
    ],
    keyTakeaways: [
      'Use references/ for content that supports but isn\'t essential',
      'The main SKILL.md stays focused and under 500 lines',
      'Progressive disclosure: references load only when needed',
    ],
    sourceUrl: 'https://github.com/anthropics/skills',
  },
  {
    id: 'executive-summary',
    name: 'executive-summary',
    displayName: 'Executive Summary',
    complexity: 'medium',
    description: 'Creates formal summaries from GitHub conversations with CLI tools.',
    demonstrates: 'Scripts for external tool integration',
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        content: `---
name: executive-summary
description: Create formal executive summaries from GitHub conversations or meeting transcripts. Use when generating leadership-ready summaries.
---

# Executive Summary

Generate summaries that distill key decisions, alternatives, outcomes, and next steps from complex conversations.

## Supported Sources

- GitHub issues and pull requests
- Meeting transcripts (Zoom, Teams)

## Process

1. **Fetch source data**
   - For GitHub: Run \`scripts/fetch-github.sh <url>\`
   - For transcripts: Read from provided path

2. **Extract key elements**
   - Decisions made
   - Alternatives considered
   - Outcomes and results
   - Action items and owners

3. **Generate summary**
   - Use template from \`assets/template.md\`
   - Follow format guide in \`references/format-guide.md\`

4. **Save output**
   - Save to \`Executive Summaries/\` with date prefix`,
      },
      {
        path: 'scripts/fetch-github.sh',
        language: 'bash',
        content: `#!/bin/bash
# Fetch GitHub issue or PR data including all comments
# Usage: fetch-github.sh <github-url>

URL="$1"

if [[ -z "$URL" ]]; then
  echo "Usage: fetch-github.sh <github-url>"
  exit 1
fi

# Extract owner, repo, type, and number from URL
if [[ "$URL" =~ github.com/([^/]+)/([^/]+)/(issues|pull)/([0-9]+) ]]; then
  OWNER="\${BASH_REMATCH[1]}"
  REPO="\${BASH_REMATCH[2]}"
  TYPE="\${BASH_REMATCH[3]}"
  NUMBER="\${BASH_REMATCH[4]}"
else
  echo "Invalid GitHub URL format"
  exit 1
fi

# Fetch using gh CLI
if [[ "$TYPE" == "issues" ]]; then
  gh issue view "$NUMBER" -R "$OWNER/$REPO" --comments
else
  gh pr view "$NUMBER" -R "$OWNER/$REPO" --comments
fi`,
      },
      {
        path: 'assets/template.md',
        language: 'markdown',
        content: `# Executive Summary: {{TITLE}}

**Date:** {{DATE}}
**Source:** {{SOURCE_URL}}

## Summary

{{BRIEF_SUMMARY}}

## Key Decisions

{{DECISIONS}}

## Alternatives Considered

{{ALTERNATIVES}}

## Next Steps

{{ACTION_ITEMS}}

---
*Generated from {{SOURCE_TYPE}}*`,
      },
    ],
    keyTakeaways: [
      'Scripts enable skills to interact with external systems',
      'Keep scripts simple and focused on data retrieval',
      'Use assets for templates the agent should use verbatim',
    ],
    sourceUrl: 'https://github.com/anthropics/skills',
  },
  {
    id: 'weekly-snippets',
    name: 'weekly-snippets',
    displayName: 'Weekly Snippets',
    complexity: 'medium',
    description: 'Interactive snippets builder that composes multiple skills.',
    demonstrates: 'Skill composition—references other skills',
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        content: `---
name: weekly-snippets
description: Interactive weekly snippets builder for gathering and drafting accomplishment summaries. Use when creating weekly status updates.
---

# Weekly Snippets

Build weekly accomplishment summaries by gathering from multiple sources.

## Related Skills

This skill works best with:
- **voice-and-tone**: Apply when drafting snippet prose
- **who-am-i**: Use for context about role and team

## Process

1. **Identify time range**
   - Friday through Thursday (standard snippet week)

2. **Gather from sources** (in order)
   - Weekly Notes file
   - GitHub PRs and issues (via \`gh\` CLI)
   - Meeting Notes folder

3. **Draft sections**
   - Ships: What you delivered
   - Risks: What might block progress
   - Blockers: What's currently blocking
   - Ideas: Improvements or proposals
   - Collaborations: Cross-team work
   - Shoutouts: Recognition for others

4. **Apply voice-and-tone**
   - Lead with business impact
   - Use active voice
   - Include specific metrics where possible

## Format Guide

See \`references/format-guide.md\` for section templates and examples.`,
      },
      {
        path: 'references/format-guide.md',
        language: 'markdown',
        content: `# Snippets Format Guide

## Section Templates

### Ships
\`\`\`
- **[Project Name]**: Brief description of impact
  - Specific metric or outcome
  - Link to PR/issue if relevant
\`\`\`

### Risks
\`\`\`
- **[Risk]**: Description and mitigation plan
\`\`\`

### Shoutouts
\`\`\`
- **@username**: What they did and why it mattered
\`\`\`

## Writing Tips

1. Start with the impact, not the activity
2. Use numbers when you have them
3. Link to artifacts for context
4. Keep bullets to 1-2 lines each`,
      },
    ],
    keyTakeaways: [
      'Use "Related Skills" to compose workflows',
      'Skills can be interactive, guiding the user through steps',
      'Reference other skills for consistent voice and context',
    ],
    sourceUrl: 'https://github.com/anthropics/skills',
  },
  {
    id: 'visual-ui-qa',
    name: 'visual-ui-qa',
    displayName: 'Visual UI QA',
    complexity: 'high',
    description: 'Multimodal skill that analyzes screenshots for visual testing.',
    demonstrates: 'Most sophisticated—multimodal input and complex decision trees',
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        content: `---
name: visual-ui-qa
description: Analyze UI screenshots for visual defects, accessibility issues, and design consistency. Use when testing visual elements or reviewing UI changes.
---

# Visual UI QA

Perform visual quality assurance on UI screenshots using multimodal analysis.

## Requirements

This skill requires multimodal (vision) capability. If your agent doesn't support image analysis natively, use the \`scripts/analyze-screenshot.sh\` script which calls a vision model via the \`llm\` CLI.

If analysis fails, inform the user:
> "I'm unable to analyze this screenshot. To enable visual analysis, install the llm CLI (https://llm.datasette.io) and run: \`scripts/analyze-screenshot.sh <image-path>\`"

## Capabilities

- Detect visual regressions between baseline and current
- Identify accessibility issues (contrast, touch targets)
- Check design consistency (spacing, alignment, colors)
- Verify responsive behavior across breakpoints

## Process

### 1. Capture or Receive Screenshot
Use \`scripts/capture-screenshot.js <url>\` or accept an image path from the user.

### 2. Analyze Visual Elements

**Layout Analysis:**
- Check alignment and spacing consistency
- Verify responsive breakpoint behavior
- Identify overflow or clipping issues

**Color & Contrast:**
- Verify WCAG contrast ratios (AA minimum)
- Check color consistency with design tokens
- Identify color blindness accessibility issues

**Typography:**
- Check font sizes meet minimum requirements
- Verify line height and letter spacing
- Identify truncation or overflow issues

### 3. Compare with Baseline (if provided)
- Pixel-level diff analysis
- Highlight changed regions
- Classify changes: intentional vs regression

### 4. Generate Report

Use template from \`assets/report-template.md\`:
- Summary of findings
- Severity classification (critical/major/minor)
- Screenshots with annotations
- Recommended fixes

## Severity Definitions

See \`references/severity-guide.md\` for classification criteria.`,
      },
      {
        path: 'references/severity-guide.md',
        language: 'markdown',
        content: `# Severity Classification

## Critical
- Prevents user from completing task
- WCAG AAA contrast failure on essential content
- Broken layout that hides content
- Incorrect data display

## Major
- Significant visual regression
- WCAG AA contrast failure
- Misaligned elements that confuse flow
- Missing visual feedback for interactions

## Minor
- Small spacing inconsistencies
- Slight color variations from design
- Non-essential decorative issues
- Pixel-level differences unlikely to notice`,
      },
      {
        path: 'scripts/capture-screenshot.js',
        language: 'javascript',
        content: `#!/usr/bin/env node
/**
 * Capture consistent screenshots for visual testing
 * Usage: capture-screenshot.js <url> [--viewport=1280x720] [--output=screenshot.png]
 */

const { chromium } = require('playwright')

async function captureScreenshot(url, options = {}) {
  const viewport = options.viewport || { width: 1280, height: 720 }
  const output = options.output || 'screenshot.png'

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport })

  await page.goto(url, { waitUntil: 'networkidle' })

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready)

  await page.screenshot({
    path: output,
    fullPage: false
  })

  await browser.close()
  console.log(\`Screenshot saved to \${output}\`)
}

// Parse args and run
const [,, url, ...args] = process.argv
if (!url) {
  console.error('Usage: capture-screenshot.js <url>')
  process.exit(1)
}

captureScreenshot(url)`,
      },
      {
        path: 'scripts/analyze-screenshot.sh',
        language: 'bash',
        content: `#!/bin/bash
# Analyze a screenshot using a vision model via the llm CLI
# Usage: analyze-screenshot.sh <image-path> [prompt]
# Requires: llm CLI (https://llm.datasette.io) with a vision model configured

IMAGE="$1"
PROMPT="\${2:-Analyze this UI screenshot for visual defects, accessibility issues, and design consistency. Report findings by severity (critical, major, minor).}"

if [[ -z "$IMAGE" ]]; then
  echo "Usage: analyze-screenshot.sh <image-path> [prompt]"
  exit 1
fi

if ! command -v llm &> /dev/null; then
  echo "Error: llm CLI not found. Install from https://llm.datasette.io"
  exit 1
fi

# Use llm with attachment flag for image input
llm -m gpt-4o "$PROMPT" -a "$IMAGE"`,
      },
      {
        path: 'assets/report-template.md',
        language: 'markdown',
        content: `# Visual QA Report

**URL:** {{URL}}
**Date:** {{DATE}}
**Viewport:** {{VIEWPORT}}

## Summary

{{SUMMARY}}

## Findings

### Critical ({{CRITICAL_COUNT}})

{{CRITICAL_FINDINGS}}

### Major ({{MAJOR_COUNT}})

{{MAJOR_FINDINGS}}

### Minor ({{MINOR_COUNT}})

{{MINOR_FINDINGS}}

## Recommendations

{{RECOMMENDATIONS}}

---
*Report generated by visual-ui-qa skill*`,
      },
    ],
    keyTakeaways: [
      'Skills can accept multimodal input (images)',
      'Gracefully degrade when capabilities are missing',
      'Use CLI tools like llm to add vision to any agent',
      'Scripts can integrate with external tools (Playwright, llm)',
    ],
    sourceUrl: 'https://github.com/anthropics/skills',
  },
  {
    id: 'advisor',
    name: 'advisor',
    displayName: 'Interactive Workflow Advisor',
    complexity: 'high',
    description: 'Interactive workflow advisor that helps you choose optimal AI primitives from agentconfig.org based on your specific workflow needs, skill level, and tooling preferences.',
    demonstrates: 'Skill composition with external data (fetches llms-full.txt), progressive questioning, and tailored recommendations',
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        content: `---
name: advisor
description: Interactive workflow advisor that helps you choose optimal AI primitives from agentconfig.org based on your specific workflow needs, skill level, and tooling preferences. Use when deciding which primitives to implement or how to structure your AI configuration.
---

# Interactive Workflow Advisor

Help users discover and prioritize the right AI primitives from agentconfig.org for their specific workflow, team, and skill level.

## Your Role

You are an expert consultant on AI coding assistant configuration. Your job is to:
1. Understand the user's current workflow and pain points
2. Recommend the most impactful AI primitives from agentconfig.org
3. Explain *why* each primitive solves their specific needs
4. Provide implementation guidance matched to their skill level
5. Warn about common pitfalls for their setup

## Step 1: Load the Primitive Reference

Before asking any questions, fetch the complete primitive documentation:

**Read:** https://agentconfig.org/llms-full.txt

This file contains all 10 AI primitives organized into three categories:
- **Capability (Execution):** Agent Mode, Skills, Tool Integrations (MCP)
- **Customization (Instructions):** Instructions, Path-Scoped Rules, Slash Commands
- **Control (Safety):** Custom Agents, Permissions & Guardrails, Lifecycle Hooks, Verification/Evals

## Step 2: Understand the User's Context

Ask 2-3 clarifying questions to understand their workflow:

### Essential Questions

1. **What's your primary pain point with AI coding assistants right now?**
   - Examples: "Inconsistent code style", "Too many manual steps", "Need to enforce safety rules", "Want better debugging help"

2. **What's your setup?**
   - Role: solo developer, team lead, platform team, etc.
   - Team size: solo, small team (2-10), large org (10+)
   - Primary tool: GitHub Copilot, Claude Code, or both
   - Skill level: beginner (new to AI tools), intermediate (use daily), advanced (configured custom workflows)

### Optional Follow-Up Questions

Ask these if needed to narrow recommendations:
- "Do you work in a monorepo or multi-repo setup?"
- "Are different parts of your system governed by different rules?" (e.g., frontend vs backend)
- "Do you need to integrate with external systems?" (databases, GitHub, monitoring tools)
- "Is this for personal use or scaling across a team?"

## Step 3: Analyze and Recommend

Based on their answers, recommend **3-5 primitives** in priority order.

### Common Workflow Patterns → Primitive Recommendations

**Pain Point: "Inconsistent code style across AI-generated code"**
→ Start with: Instructions
→ Next: Path-Scoped Rules (if monorepo/multi-language)
→ Combine with: Verification/Evals (to catch violations)

**Pain Point: "Repeating the same prompts over and over"**
→ Start with: Slash Commands
→ Next: Skills (for multi-step procedures)
→ Combine with: Instructions (for consistent outputs)

**Pain Point: "Need AI to work until task is complete, not just give suggestions"**
→ Start with: Agent Mode
→ Next: Skills (to guide multi-step work)
→ Combine with: Verification/Evals (to validate outputs)

For complete workflow patterns and implementation guidance, see the full skill documentation.

## Related Skills

This skill works well with:
- **semantic-commit**: Use after implementing Verification/Evals to ensure commits follow conventions
- **create-component**: Reference when explaining Skills for component scaffolding workflows`,
      },
    ],
    keyTakeaways: [
      'Skills can fetch external data to provide contextual recommendations',
      'Progressive questioning helps tailor advice to user needs',
      'Pattern matching (pain points → primitives) makes recommendations actionable',
      'Skills can reference other skills to build comprehensive workflows',
    ],
    sourceUrl: 'https://github.com/jonmagic/agentconfig.org/tree/main/.github/skills/advisor',
  },
] as const

export const exampleSectionIds = skillExamples.map((e) => e.id)
