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
  {
    id: 'script-usage-patterns',
    title: 'Script Usage Patterns',
    description: 'When and why to use scripts for deterministic operations.',
    content: `Scripts excel at tasks requiring **deterministic, consistent output**—especially when modifying complex configuration files. While agents are great at understanding context and generating code, scripts guarantee precise, repeatable results.

## The Config File Modification Pattern

When agents need to modify complex configuration files (YAML, JSON, TOML), use this pattern:

1. **Agent parses the requirement** → Understands what needs to change
2. **Agent calls a script with parameters** → Passes values, paths, or operations
3. **Script handles the modification** → Uses proper parsers and formatters
4. **Agent verifies the result** → Confirms the change was applied correctly

**Example workflow:**
\`\`\`markdown
# In your SKILL.md

When modifying \`.github/workflows/ci.yml\`:

1. Identify the required change (e.g., update Node version)
2. Run: \`scripts/update-workflow.sh ci.yml node-version 20\`
3. Verify the change with \`git diff\`
\`\`\`

## Why Scripts Beat Agent-Generated Code for Configs

### YAML-Specific Concerns

**Indentation is semantic:**
\`\`\`yaml
services:
  database:        # 2 spaces
    image: postgres
    ports:
      - 5432:5432  # 6 spaces - nesting matters!
\`\`\`

Agents might generate valid YAML with inconsistent indentation that breaks tools expecting strict formatting.

**Comments are preserved:**
\`\`\`yaml
# Production database config - DO NOT CHANGE
database:
  host: prod.example.com
\`\`\`

YAML parsers preserve comments; hand-edited files might lose them. Scripts using proper YAML libraries maintain comments.

**Anchors and aliases:**
\`\`\`yaml
defaults: &defaults
  timeout: 30
  retries: 3

production:
  <<: *defaults
  timeout: 60
\`\`\`

Agents unfamiliar with YAML anchors might duplicate data instead of reusing references.

### JSON-Specific Concerns

**Strict formatting requirements:**
- No trailing commas
- Double quotes only
- Specific escaping rules

**Ordering can matter:**
In some tools (like package.json dependencies), alphabetical ordering is conventional. Scripts ensure consistency.

### The Determinism Principle

**Agent-generated code is "loosey-goosey":**
- May vary formatting between runs
- Might miss edge cases in complex structures
- Can introduce subtle inconsistencies

**Scripts are deterministic:**
- Same input → same output, every time
- Use battle-tested parsers (PyYAML, js-yaml, jq)
- Preserve formatting conventions automatically
- Handle edge cases consistently

## When to Use Scripts vs Agent Code

| Use Scripts For | Use Agent Code For |
|----------------|-------------------|
| Modifying config files (YAML, JSON, TOML) | Writing new application code |
| Updating infrastructure definitions (K8s, Docker Compose) | Creating test cases |
| Batch refactoring structured data | Implementing business logic |
| Validating file formats | Debugging and exploration |
| Transforming between formats | Documentation generation |

## Practical Examples

### Example 1: Kubernetes Manifest Updates

**Problem:** Update image tags across multiple K8s deployments without breaking YAML structure.

**Solution:**
\`\`\`bash
# scripts/update-k8s-image.sh
#!/bin/bash
MANIFEST="$1"
IMAGE="$2"
TAG="$3"

# Use yq (YAML processor) for safe updates
yq eval ".spec.template.spec.containers[0].image = \\"$IMAGE:$TAG\\"" -i "$MANIFEST"
\`\`\`

**Why script wins:**
- Preserves comments, indentation, and YAML features
- Handles nested paths reliably
- Same formatting every time

### Example 2: Package.json Dependency Management

**Problem:** Update multiple npm packages while maintaining alphabetical order and exact formatting.

**Solution:**
\`\`\`javascript
// scripts/update-deps.js
const fs = require('fs')
const pkg = require('../package.json')

function updateDependency(name, version) {
  pkg.dependencies[name] = version
  // Sort alphabetically
  pkg.dependencies = Object.keys(pkg.dependencies)
    .sort()
    .reduce((acc, key) => {
      acc[key] = pkg.dependencies[key]
      return acc
    }, {})
  
  // Write with consistent formatting
  fs.writeFileSync(
    'package.json',
    JSON.stringify(pkg, null, 2) + '\\n'
  )
}
\`\`\`

**Why script wins:**
- Maintains exact JSON formatting (2-space indent, trailing newline)
- Ensures alphabetical ordering
- Handles version resolution logic

### Example 3: Environment-Specific Config Generation

**Problem:** Generate different configs for dev/staging/prod from a base template with environment-specific overrides.

**Solution:**
\`\`\`python
# scripts/generate-config.py
import yaml
import sys

def merge_configs(base, override):
    """Deep merge override into base"""
    result = base.copy()
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = merge_configs(result[key], value)
        else:
            result[key] = value
    return result

env = sys.argv[1]  # dev, staging, prod

with open('config/base.yml') as f:
    base = yaml.safe_load(f)

with open(f'config/{env}.yml') as f:
    override = yaml.safe_load(f)

config = merge_configs(base, override)

with open(f'dist/config-{env}.yml', 'w') as f:
    yaml.dump(config, f, default_flow_style=False, sort_keys=False)
\`\`\`

**Why script wins:**
- Deep merging logic is complex and error-prone in prompts
- Consistent output formatting across environments
- Easy to test and version control

## Best Practices

1. **Use established tools**: \`yq\` for YAML, \`jq\` for JSON, language-specific parsers
2. **Validate after modification**: Have scripts check their own output
3. **Make scripts idempotent**: Running twice should be safe
4. **Keep scripts focused**: One script, one type of modification
5. **Document expected inputs**: Clear usage messages and parameter validation

## When Agent Code is Acceptable

Not everything needs a script. Agent-generated code works well when:

- The output doesn't need exact formatting (exploratory code, one-off tasks)
- You're generating new files, not modifying existing ones
- The structure is simple and well-defined
- Precision matters less than speed

**Rule of thumb:** If you'd review the output carefully anyway, agent code is fine. If you need to trust it blindly (CI/CD, production configs), use a script.`,
  },
] as const

export const conceptsSectionIds = tutorialSections.map((s) => s.id)
