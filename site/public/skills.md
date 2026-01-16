# Skills Tutorial

Tutorial for creating agent skills following the agentskills.io specification.
Covers progressive disclosure, composability, and includes 5 example skills
from minimal to sophisticated.

## Tutorial Sections

### Understanding the Spec

The structure and constraints of a SKILL.md file.

Agent Skills follow the [agentskills.io specification](https://agentskills.io/specification). Each skill lives in its own directory with a **SKILL.md** file that defines its behavior.

**Key constraints:**
- **name**: Maximum 64 characters, lowercase with hyphens, must match the directory name
- **description**: Maximum 1024 characters—this is what triggers the skill
- **Body**: Recommended under 500 lines to keep skills focused

```markdown
---
name: semantic-commit
description: Generate semantic commit messages from staged changes
---

# Semantic Commit

When the user asks to commit changes, follow these steps:

1. Run `git diff --cached` to see staged changes
2. Analyze the changes to determine the commit type
3. Generate a message following conventional commits format
```

The frontmatter tells the agent *when* to use this skill. The body tells it *how*.

---

### Progressive Disclosure

Load information only when needed.

Skills use progressive disclosure to stay token-efficient. The agent doesn't load your skill's full instructions until it's actually needed.

**The loading sequence:**
1. Agent sees only the **description** (from frontmatter)
2. If description matches the task → agent loads the **body**
3. If body references files → agent loads **references/** and **assets/**
4. If body needs tools → agent loads **scripts/**

This means a skill with 50KB of reference documentation costs almost nothing until it's invoked. Write descriptions that accurately trigger loading—no more, no less.

**Good description:**
```
description: Generate semantic commit messages from staged changes. Use when committing code.
```

**Bad description:**
```
description: A skill for commits.
```

The good description tells the agent exactly when to load this skill.

---

### Composability

Skills that reference other skills.

Skills can reference other skills to build complex workflows from simple building blocks.

**Using `## Related Skills`:**
```markdown
## Related Skills

This skill works well with:
- **voice-and-tone**: Apply when generating any written content
- **semantic-commit**: Use after completing implementation work
```

When the agent sees this section, it knows to consider loading those skills for the current workflow.

**Referencing skill files directly:**
```markdown
For writing style guidelines, see the voice-and-tone skill at:
`.github/skills/voice-and-tone/SKILL.md`
```

**Benefits of composability:**
- Keep individual skills small and focused
- Reuse common patterns (voice, commit style, testing)
- Build sophisticated workflows from simple pieces
- Update one skill and all dependent workflows improve

---

### When to Use What

Scripts vs references vs assets—a decision tree.

Skills have three optional directories for additional content:

| Directory | Purpose | Example |
|-----------|---------|---------|
| **scripts/** | Executable code the agent can run | CLI tools, validators, formatters |
| **references/** | Documentation to read | API docs, style guides, examples |
| **assets/** | Static resources | Templates, images, config files |

**Decision tree:**

```
Is it documentation the agent should read?
  → references/

Is it a file the agent should use as-is?
  → assets/

Is it code the agent should execute?
  → scripts/
```

**Example skill structure:**
```
executive-summary/
├── SKILL.md           # Core instructions
├── references/
│   └── format-guide.md  # How to structure summaries
├── scripts/
│   └── fetch-github.sh  # CLI to fetch issue/PR data
└── assets/
    └── template.md      # Output template
```

The agent loads these progressively—only when the SKILL.md body references them.

---

### Keeping Skills Lean

Under 500 lines and why it matters.

The spec recommends keeping SKILL.md files under 500 lines. Here's why:

**Token efficiency**: Every line in SKILL.md is loaded when the skill activates. Large files burn through context unnecessarily.

**Cognitive load**: Both humans and agents understand focused skills better than sprawling ones.

**Composability**: Smaller skills are easier to combine and reuse.

**How to stay lean:**

1. **Move reference material** → Put style guides, examples, and documentation in `references/`
2. **Extract executable logic** → CLI tools and validators go in `scripts/`
3. **Split large skills** → If a skill does 5 things, maybe it's 5 skills
4. **Use progressive loading** → Reference external files instead of embedding content

**Before (500+ lines in SKILL.md):**
```markdown
# Weekly Snippets

[... 200 lines of format instructions ...]
[... 150 lines of examples ...]
[... 100 lines of source-gathering logic ...]
```

**After (focused SKILL.md):**
```markdown
# Weekly Snippets

For format guidelines, see `references/format-guide.md`.
For examples, see `references/examples.md`.

When gathering sources, run `scripts/gather-sources.sh`.
```

---

## Example Skills

Five example skills demonstrating different complexity levels and patterns:

### Who Am I

**Complexity:** minimal
**Demonstrates:** Pure documentation skill (~20 lines)

Identity context skill—pure documentation with no external dependencies.

**SKILL.md:**
```markdown
---
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
When writing on my behalf, use first-person perspective with a thoughtful, principal-engineer voice.
```

**Key Takeaways:**
- Skills can be pure documentation with no code
- The description determines when the skill loads
- Keep it focused—this skill does one thing well

---

### Voice & Tone

**Complexity:** low
**Demonstrates:** Documentation with references/ for progressive disclosure

Writing style guide with reference documentation.

**SKILL.md:**
```markdown
---
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

For detailed patterns and examples, see `references/patterns.md`.
```

**references/patterns.md:**
```markdown
# Voice Patterns

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
- "This changed how I think about..."
```

**Key Takeaways:**
- Use references/ for content that supports but isn't essential
- The main SKILL.md stays focused and under 500 lines
- Progressive disclosure: references load only when needed

---

### Executive Summary

**Complexity:** medium
**Demonstrates:** Scripts for external tool integration

Creates formal summaries from GitHub conversations with CLI tools.

**SKILL.md:**
```markdown
---
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
   - For GitHub: Run `scripts/fetch-github.sh <url>`
   - For transcripts: Read from provided path

2. **Extract key elements**
   - Decisions made
   - Alternatives considered
   - Outcomes and results
   - Action items and owners

3. **Generate summary**
   - Use template from `assets/template.md`
   - Follow format guide in `references/format-guide.md`

4. **Save output**
   - Save to `Executive Summaries/` with date prefix
```

**scripts/fetch-github.sh:**
```bash
#!/bin/bash
# Fetch GitHub issue or PR data including all comments
# Usage: fetch-github.sh <github-url>

URL="$1"

if [[ -z "$URL" ]]; then
  echo "Usage: fetch-github.sh <github-url>"
  exit 1
fi

# Extract owner, repo, type, and number from URL
if [[ "$URL" =~ github.com/([^/]+)/([^/]+)/(issues|pull)/([0-9]+) ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
  TYPE="${BASH_REMATCH[3]}"
  NUMBER="${BASH_REMATCH[4]}"
else
  echo "Invalid GitHub URL format"
  exit 1
fi

# Fetch using gh CLI
if [[ "$TYPE" == "issues" ]]; then
  gh issue view "$NUMBER" -R "$OWNER/$REPO" --comments
else
  gh pr view "$NUMBER" -R "$OWNER/$REPO" --comments
fi
```

**assets/template.md:**
```markdown
# Executive Summary: {{TITLE}}

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
*Generated from {{SOURCE_TYPE}}*
```

**Key Takeaways:**
- Scripts enable skills to interact with external systems
- Keep scripts simple and focused on data retrieval
- Use assets for templates the agent should use verbatim

---

### Weekly Snippets

**Complexity:** medium
**Demonstrates:** Skill composition—references other skills

Interactive snippets builder that composes multiple skills.

**SKILL.md:**
```markdown
---
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
   - GitHub PRs and issues (via `gh` CLI)
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

See `references/format-guide.md` for section templates and examples.
```

**references/format-guide.md:**
```markdown
# Snippets Format Guide

## Section Templates

### Ships
```
- **[Project Name]**: Brief description of impact
  - Specific metric or outcome
  - Link to PR/issue if relevant
```

### Risks
```
- **[Risk]**: Description and mitigation plan
```

### Shoutouts
```
- **@username**: What they did and why it mattered
```

## Writing Tips

1. Start with the impact, not the activity
2. Use numbers when you have them
3. Link to artifacts for context
4. Keep bullets to 1-2 lines each
```

**Key Takeaways:**
- Use "Related Skills" to compose workflows
- Skills can be interactive, guiding the user through steps
- Reference other skills for consistent voice and context

---

### Visual UI QA

**Complexity:** high
**Demonstrates:** Most sophisticated—multimodal input and complex decision trees

Multimodal skill that analyzes screenshots for visual testing.

**SKILL.md:**
```markdown
---
name: visual-ui-qa
description: Analyze UI screenshots for visual defects, accessibility issues, and design consistency. Use when testing visual elements or reviewing UI changes.
---

# Visual UI QA

Perform visual quality assurance on UI screenshots using multimodal analysis.

## Requirements

This skill requires multimodal (vision) capability. If your agent doesn't support image analysis natively, use the `scripts/analyze-screenshot.sh` script which calls a vision model via the `llm` CLI.

If analysis fails, inform the user:
> "I'm unable to analyze this screenshot. To enable visual analysis, install the llm CLI (https://llm.datasette.io) and run: `scripts/analyze-screenshot.sh <image-path>`"

## Capabilities

- Detect visual regressions between baseline and current
- Identify accessibility issues (contrast, touch targets)
- Check design consistency (spacing, alignment, colors)
- Verify responsive behavior across breakpoints

## Process

### 1. Capture or Receive Screenshot
Use `scripts/capture-screenshot.js <url>` or accept an image path from the user.

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

Use template from `assets/report-template.md`:
- Summary of findings
- Severity classification (critical/major/minor)
- Screenshots with annotations
- Recommended fixes

## Severity Definitions

See `references/severity-guide.md` for classification criteria.
```

**references/severity-guide.md:**
```markdown
# Severity Classification

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
- Pixel-level differences unlikely to notice
```

**scripts/capture-screenshot.js:**
```javascript
#!/usr/bin/env node
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
  console.log(`Screenshot saved to ${output}`)
}

// Parse args and run
const [,, url, ...args] = process.argv
if (!url) {
  console.error('Usage: capture-screenshot.js <url>')
  process.exit(1)
}

captureScreenshot(url)
```

**scripts/analyze-screenshot.sh:**
```bash
#!/bin/bash
# Analyze a screenshot using a vision model via the llm CLI
# Usage: analyze-screenshot.sh <image-path> [prompt]
# Requires: llm CLI (https://llm.datasette.io) with a vision model configured

IMAGE="$1"
PROMPT="${2:-Analyze this UI screenshot for visual defects, accessibility issues, and design consistency. Report findings by severity (critical, major, minor).}"

if [[ -z "$IMAGE" ]]; then
  echo "Usage: analyze-screenshot.sh <image-path> [prompt]"
  exit 1
fi

if ! command -v llm &> /dev/null; then
  echo "Error: llm CLI not found. Install from https://llm.datasette.io"
  exit 1
fi

# Use llm with attachment flag for image input
llm -m gpt-4o "$PROMPT" -a "$IMAGE"
```

**assets/report-template.md:**
```markdown
# Visual QA Report

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
*Report generated by visual-ui-qa skill*
```

**Key Takeaways:**
- Skills can accept multimodal input (images)
- Gracefully degrade when capabilities are missing
- Use CLI tools like llm to add vision to any agent
- Scripts can integrate with external tools (Playwright, llm)

---

