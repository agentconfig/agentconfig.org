export interface TutorialSection {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly content: string
}

export const tutorialSections: readonly TutorialSection[] = [
  {
    id: 'understanding-the-spec',
    title: 'Understanding the Spec',
    description: 'The structure and constraints of a SKILL.md file.',
    content: `Agent Skills follow the [agentskills.io specification](https://agentskills.io/specification). Each skill lives in its own directory with a **SKILL.md** file that defines its behavior.

**Key constraints:**
- **name**: Maximum 64 characters, lowercase with hyphens, must match the directory name
- **description**: Maximum 1024 characters—this is what triggers the skill
- **Body**: Recommended under 500 lines to keep skills focused

\`\`\`markdown
---
name: semantic-commit
description: Generate semantic commit messages from staged changes
---

# Semantic Commit

When the user asks to commit changes, follow these steps:

1. Run \`git diff --cached\` to see staged changes
2. Analyze the changes to determine the commit type
3. Generate a message following conventional commits format
\`\`\`

The frontmatter tells the agent *when* to use this skill. The body tells it *how*.`,
  },
  {
    id: 'progressive-disclosure',
    title: 'Progressive Disclosure',
    description: 'Load information only when needed.',
    content: `Skills use progressive disclosure to stay token-efficient. The agent doesn't load your skill's full instructions until it's actually needed.

**The loading sequence:**
1. Agent sees only the **description** (from frontmatter)
2. If description matches the task → agent loads the **body**
3. If body references files → agent loads **references/** and **assets/**
4. If body needs tools → agent loads **scripts/**

This means a skill with 50KB of reference documentation costs almost nothing until it's invoked. Write descriptions that accurately trigger loading—no more, no less.

**Good description:**
\`\`\`
description: Generate semantic commit messages from staged changes. Use when committing code.
\`\`\`

**Bad description:**
\`\`\`
description: A skill for commits.
\`\`\`

The good description tells the agent exactly when to load this skill.`,
  },
  {
    id: 'composability',
    title: 'Composability',
    description: 'Skills that reference other skills.',
    content: `Skills can reference other skills to build complex workflows from simple building blocks.

**Using \`## Related Skills\`:**
\`\`\`markdown
## Related Skills

This skill works well with:
- **voice-and-tone**: Apply when generating any written content
- **semantic-commit**: Use after completing implementation work
\`\`\`

When the agent sees this section, it knows to consider loading those skills for the current workflow.

**Referencing skill files directly:**
\`\`\`markdown
For writing style guidelines, see the voice-and-tone skill at:
\`.github/skills/voice-and-tone/SKILL.md\`
\`\`\`

**Benefits of composability:**
- Keep individual skills small and focused
- Reuse common patterns (voice, commit style, testing)
- Build sophisticated workflows from simple pieces
- Update one skill and all dependent workflows improve`,
  },
  {
    id: 'when-to-use-what',
    title: 'When to Use What',
    description: 'Scripts vs references vs assets—a decision tree.',
    content: `Skills have three optional directories for additional content:

| Directory | Purpose | Example |
|-----------|---------|---------|
| **scripts/** | Executable code the agent can run | CLI tools, validators, formatters |
| **references/** | Documentation to read | API docs, style guides, examples |
| **assets/** | Static resources | Templates, images, config files |

**Decision tree:**

\`\`\`
Is it documentation the agent should read?
  → references/

Is it a file the agent should use as-is?
  → assets/

Is it code the agent should execute?
  → scripts/
\`\`\`

**Example skill structure:**
\`\`\`
executive-summary/
├── SKILL.md           # Core instructions
├── references/
│   └── format-guide.md  # How to structure summaries
├── scripts/
│   └── fetch-github.sh  # CLI to fetch issue/PR data
└── assets/
    └── template.md      # Output template
\`\`\`

The agent loads these progressively—only when the SKILL.md body references them.`,
  },
  {
    id: 'keeping-skills-lean',
    title: 'Keeping Skills Lean',
    description: 'Under 500 lines and why it matters.',
    content: `The spec recommends keeping SKILL.md files under 500 lines. Here's why:

**Token efficiency**: Every line in SKILL.md is loaded when the skill activates. Large files burn through context unnecessarily.

**Cognitive load**: Both humans and agents understand focused skills better than sprawling ones.

**Composability**: Smaller skills are easier to combine and reuse.

**How to stay lean:**

1. **Move reference material** → Put style guides, examples, and documentation in \`references/\`

2. **Extract executable logic** → CLI tools and validators go in \`scripts/\`

3. **Split large skills** → If a skill does 5 things, maybe it's 5 skills

4. **Use progressive loading** → Reference external files instead of embedding content

**Before (500+ lines in SKILL.md):**
\`\`\`markdown
# Weekly Snippets

[... 200 lines of format instructions ...]
[... 150 lines of examples ...]
[... 100 lines of source-gathering logic ...]
\`\`\`

**After (focused SKILL.md):**
\`\`\`markdown
# Weekly Snippets

For format guidelines, see \`references/format-guide.md\`.
For examples, see \`references/examples.md\`.

When gathering sources, run \`scripts/gather-sources.sh\`.
\`\`\``,
  },
] as const

export const conceptsSectionIds = tutorialSections.map((s) => s.id)
