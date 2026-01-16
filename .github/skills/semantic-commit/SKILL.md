---
name: semantic-commit
description: Generate semantic commit messages following conventional commit format for agentconfig.org. Use when creating commits, reviewing staged changes, or when the user asks for help with commit messages.
---

# Semantic Commit

## Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring, no behavior change |
| `test` | Adding or updating tests |
| `chore` | Maintenance, config, dependencies |

## Scopes (Project-Specific)

Common scopes for agentconfig.org:
- `file-tree` - FileTree component/visualization
- `cards` - PrimitiveCards component
- `comparison` - ProviderComparison component
- `hero` - Hero section
- `navigation` - Navigation component
- `theme` - ThemeProvider, ThemeToggle, dark/light mode
- `data` - Data files in site/src/data/
- `e2e` - Playwright tests
- `agents` - Agent instruction files (AGENTS.md, etc.)
- `copilot` - Copilot-specific instructions
- `claude` - Claude-specific instructions

## Rules

1. **Atomic commits** - One logical change per commit
2. **Minimize files** - Prefer multiple small commits over one large commit
3. **Clear descriptions** - Should complete: "This commit will..."
4. **Always include scope** when applicable
5. **Use imperative mood** - "add feature" not "added feature"

## Good Examples

```
feat(file-tree): add collapsible tree node component
test(navigation): add smooth scroll behavior tests
fix(theme): correct dark mode background color
docs(agents): update tech stack to Preact
refactor(cards): extract card layout to separate component
chore(deps): update playwright to v1.40
```

## Bad Examples

```
update stuff                              # Too vague
feat: add file tree and cards and recipes # Too many changes
WIP                                       # Incomplete
Fixed the bug                             # Past tense, no scope
```

## Multi-File Commits

When changes span multiple areas, consider:
1. Can this be split into separate commits?
2. If not, use the most significant scope
3. List additional changes in the commit body

```
feat(file-tree): add expand/collapse functionality

Also updates:
- TreeNode component styling
- FileTree section layout
```
