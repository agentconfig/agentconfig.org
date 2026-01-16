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
    sourceUrl: 'https://github.com/github/jonmagic-ai-tutorial/tree/main/.github/skills',
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
    sourceUrl: 'https://github.com/github/jonmagic-ai-tutorial/tree/main/.github/skills',
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

## Capabilities

- Detect visual regressions between baseline and current
- Identify accessibility issues (contrast, touch targets)
- Check design consistency (spacing, alignment, colors)
- Verify responsive behavior across breakpoints

## Process

### 1. Receive Screenshot
Accept screenshot as image input or file path.

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

See \`references/severity-guide.md\` for classification criteria.

## Integration

For automated CI integration, use \`scripts/capture-screenshot.js\` to capture consistent screenshots.`,
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

const puppeteer = require('puppeteer')

async function captureScreenshot(url, options = {}) {
  const viewport = options.viewport || { width: 1280, height: 720 }
  const output = options.output || 'screenshot.png'

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport(viewport)
  await page.goto(url, { waitUntil: 'networkidle2' })

  // Wait for fonts and images to load
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
      'Complex skills break down into clear phases',
      'Use severity classifications for actionable output',
      'Scripts can integrate with external tools (Puppeteer)',
    ],
    sourceUrl: 'https://github.com/anthropics/skills',
  },
] as const

export const exampleSectionIds = skillExamples.map((e) => e.id)
