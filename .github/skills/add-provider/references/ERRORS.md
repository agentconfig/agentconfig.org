# Error Handling & Troubleshooting

Common issues and solutions during provider integration.

## TypeScript Errors

### Error: "Property 'cursor' is missing in type"

**When**: After completing Stream 1 (Type System)

**Cause**: You've added the provider to the type definition, but haven't added data yet.

**Solution**: Continue to Stream 2 (Data Layer). This is expected.

```
error TS2741: Property 'cursor' is missing in type '{ copilot: ProviderSupport; claude: ProviderSupport; }' but required in type 'Record<Provider, ProviderSupport>'.
```

---

### Error: "Type 'cursor' is not assignable to type"

**When**: After modifying comparison.ts or primitives.ts

**Cause**: Provider type doesn't match. Typo in provider name (e.g., `'Cursor'` instead of `'cursor'`).

**Solution**: Check for case sensitivity:

```typescript
// ✗ Wrong
provider: 'Cursor'    // Uppercase

// ✓ Correct
provider: 'cursor'    // Lowercase
```

---

### Error: "Cannot find module or corresponding type declaration"

**When**: Running typecheck after adding file tree

**Cause**: Import statement or export statement incorrect in fileTree.ts

**Solution**:
1. Verify `export const cursorTree` and `export const cursorGlobalTree` are declared
2. Verify they're added to the `trees` and `globalTrees` mapping objects
3. Check for typos in variable names

```typescript
// ✓ Correct structure
export const cursorTree: FileNode = { ... }
export const cursorGlobalTree: FileNode = { ... }

export const trees: Record<Provider, FileNode> = {
  copilot: copilotTree,
  claude: claudeTree,
  cursor: cursorTree,  // Must be included
}
```

---

## E2E Test Failures

### Error: "Expected 21 badges, received 18"

**When**: Running E2E tests in Stream 4

**Cause**: Support badge count changed because your provider has different support levels than expected.

**Solution**: Count the actual badges:

```typescript
// Count manually:
// 13 primitives × 4 providers = 52 total support badges
// Only "Full Support" badges are a subset of that total, so count them
// directly rather than deriving them from the 52-badge total.

// Better approach: Run test and see actual number, then update
const fullSupportBadges = table.getByText('Full Support')
await expect(fullSupportBadges).toHaveCount(18)  // Update to your actual count
```

**To find the right number:**
1. Run the test and let it fail
2. Note the actual count
3. Update test with that count

---

### Error: "Timeout waiting for element 'Cursor implementation text'"

**When**: Running expanded row tests

**Cause**: The implementation text doesn't match what the test expects.

**Solution**:
1. Check the `cursor` implementation entry in `primitives.ts` for the exact text (`comparison.ts`
   renders whatever `primitives.ts` says — it has no separate implementation text to edit)
2. Update test to match:

```typescript
// In primitives.ts:
{
  provider: 'cursor',
  implementation: 'Cursor Agent mode for multi-step execution',
  // ...
}

// In test:
await expect(page.getByText('Cursor Agent mode for multi-step execution')).toBeVisible()
// NOT: await expect(page.getByText('Agent mode')).toBeVisible()
```

---

### Error: "Expected 3 copy buttons, found 2"

**When**: Testing copy buttons in expanded row

**Cause**: Missing provider section in ExpandedRow component.

**Solution**: Verify all 3 provider sections are in the expanded row template:

```typescript
// ExpandedRow should have 3 sections:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Copilot section */}
  {/* Claude section */}
  {/* Cursor section - did you add this? */}
</div>
```

Check colSpan and grid column count:

```typescript
// ✗ Wrong
<td colSpan={3}>  {/* Only 3 columns */}
  <div className="grid grid-cols-1 md:grid-cols-2">  {/* Only 2 columns */}

// ✓ Correct
<td colSpan={4}>  {/* 4 columns: primitive + 3 providers */}
  <div className="grid grid-cols-1 md:grid-cols-3">  {/* 3 provider columns */}
```

---

## UI Layout Issues

### Problem: Table layout is misaligned

**Symptoms**: Column widths don't align, content overflows

**Cause**: colSpan doesn't match column count

**Solution**:
- Table headers: 4 `<th>` elements (primitive + 3 providers)
- Table rows: 4 `<td>` elements
- Expanded rows: `colSpan={4}`

```typescript
// ✓ Correct
<thead>
  <tr>
    <th>Primitive</th>      {/* 1 */}
    <th>Copilot</th>        {/* 2 */}
    <th>Claude</th>         {/* 3 */}
    <th>Cursor</th>         {/* 4 */}
  </tr>
</thead>
<tbody>
  <tr>
    <td>{name}</td>         {/* 1 */}
    <td><Badge /></td>      {/* 2 */}
    <td><Badge /></td>      {/* 3 */}
    <td><Badge /></td>      {/* 4 */}
  </tr>
  <tr>
    <td colSpan={4}>        {/* ALL 4 columns */}
      {/* Expanded content */}
    </td>
  </tr>
</tbody>
```

---

### Problem: Mobile layout broken on 3+ providers

**Symptoms**: Table doesn't fit on small screens, content cuts off

**Cause**: `md:grid-cols-3` grid layout is too wide for mobile

**Solution**: Grid automatically stacks on mobile (`grid-cols-1`), only expands on medium+ screens:

```typescript
// ✓ Correct - stacks on mobile, 3 columns on medium+
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
```

For very large tables, consider horizontal scroll:

```typescript
// Alternative: horizontal scroll wrapper for 3+ providers
<div className="overflow-x-auto">
  <div className="grid grid-cols-3 gap-6 min-w-min">
    {/* Provider sections */}
  </div>
</div>
```

---

### Problem: Dark mode styling broken

**Symptoms**: Text not visible in dark mode, colors wrong

**Cause**: Missing dark: prefixes in Tailwind classes

**Solution**: Verify dark mode classes:

```typescript
// ✗ Wrong - doesn't work in dark mode
<span className="bg-emerald-500/10 text-emerald-600">
  Full Support
</span>

// ✓ Correct - explicit dark mode
<span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
  Full Support
</span>
```

Check the `supportLevelColors` object in comparison.ts for the right classes (this mapping is provider-agnostic — it keys off `SupportLevel`, not per-provider data).

---

## Build Failures

### Error: "npm run build fails with TypeScript errors"

**Cause**: Haven't fixed TypeScript errors from type changes

**Solution**:
```bash
npm run typecheck  # See all errors
```

Go through each error and:
1. Add missing provider implementations to primitives.ts (all 13 primitives) — comparison.ts and
   providerProfiles.ts pick these up automatically once the `comparisonData`/mapping call includes
   the new provider
2. Add missing provider to fileTree.ts (trees mapping)
3. Add missing provider label to PrimitiveCard.tsx

---

### Error: "Cannot find module '.cursor...'"

**Cause**: Import path typo in fileTree.ts

**Solution**: Verify imports at top of fileTree.ts:

```typescript
// Check these are correct:
export interface FileNode { ... }
export interface FileDetails { ... }

// And exports match usage:
export const cursorTree: FileNode = { ... }
export const trees: Record<Provider, FileNode> = {
  // ...
  cursor: cursorTree,  // Variable name must match
}
```

---

## LLMs Generation Issues

### ⚠️ CRITICAL: Generation Script Updates Required (Stream 6)

**When**: After completing Stream 2 (Data Layer)

**Why**: The generation script has hardcoded rendering for only 2 providers (Copilot, Claude).
Adding a 3rd provider breaks the script without updates.

**Solution**: Update `.github/skills/generate-llms/scripts/generate-llms-full.ts` in TWO places:

**1. Update the provider comparison table rendering:**

```typescript
// ✗ Old (only 2 providers):
| Primitive | Copilot | Claude |

// ✓ New (3 providers):
| Primitive | Copilot | Claude | Cursor |
```

Find this section (~line 503) and update:

```typescript
// BEFORE:
const copilotIcon = row.copilot.level === 'full' ? '✓' : '◐' : '—'
const claudeIcon = row.claude.level === 'full' ? '✓' : '◐' : '—'
content += `| ${row.primitiveName} | ${copilotIcon} ... | ${claudeIcon} ... |\n`

// AFTER:
const copilotIcon = row.copilot.level === 'full' ? '✓' : '◐' : '—'
const claudeIcon = row.claude.level === 'full' ? '✓' : '◐' : '—'
const cursorIcon = row.cursor.level === 'full' ? '✓' : '◐' : '—'
content += `| ${row.primitiveName} | ${copilotIcon} ... | ${claudeIcon} ... | ${cursorIcon} ... |\n`
```

**2. Add provider config file locations section:**

Find the "Config File Locations" section (~line 516) and add your provider:

```markdown
**Cursor:**
- Project Instructions: `.cursor/instructions.md`
- Global Config: `~/.cursor/settings.json`
- MCP Servers: `~/.cursor/mcp.json`
```

Then regenerate:

```bash
bun .github/skills/generate-llms/scripts/generate-llms-full.ts
```

**This is NOT optional** - if you skip it, the generated files will be incomplete.

---

### Problem: Provider name shows as "Claude Code" in llms-full.txt

**Symptoms**: Generated file shows provider as "Claude Code" instead of "Cursor"

**Cause**: Generation script defaults to "Claude Code" for unknown providers

**Solution**: Update provider name mapping in `.github/skills/generate-llms/scripts/generate-llms-full.ts`:

```typescript
// ✗ Old way - defaults to Claude for unknown providers
`| ${impl.provider === 'copilot' ? 'GitHub Copilot' : 'Claude Code'} | ...`

// ✓ New way - handles all providers
const providerName =
  impl.provider === 'copilot' ? 'GitHub Copilot' :
  impl.provider === 'claude' ? 'Claude Code' :
  impl.provider === 'cursor' ? 'Cursor' :
  impl.provider;
return `| ${providerName} | ...`
```

Then regenerate:

```bash
bun .github/skills/generate-llms/scripts/generate-llms-full.ts
```

---

### Problem: llms-full.txt is missing provider data

**Symptoms**: Generated file doesn't include new provider rows

**Cause**: Generation script was already run before adding all 13 provider implementations to
primitives.ts

**Solution**:
1. Verify provider implementations are in primitives.ts (all 13 primitives)
2. Regenerate:

```bash
bun .github/skills/generate-llms/scripts/generate-llms-full.ts
```

---

## Research & Data Issues

### Problem: "I don't know if this primitive has support"

**When**: Researching provider capabilities

**Solution**: Use this priority order:
1. **Official documentation** - First source of truth
2. **Official examples** - Real code showing usage
3. **GitHub issues/discussions** - Community reports
4. **Trial/testing** - Test if you can access the provider

If still uncertain:

```typescript
// Use 'partial' as default if unsure
// This indicates: "it's possible, but we're not 100% sure"
support: 'partial'

// Leave a TODO comment
// TODO: Verify support level for cursor tool integrations (extensions API)
```

---

### Problem: "File paths don't match the provider's docs"

**Solution**: Verify file paths are correct:

1. Check provider's official documentation
2. Test creating the files yourself
3. Look at provider's examples/templates
4. Reference the official directory structure

Example for Cursor:

```typescript
// Official Cursor directory structure
.cursor/
├── instructions.md     // ✓ Verified via official docs
├── settings.json       // ✓ Verified via official docs
└── rules/             // ✓ Verified via official docs
```

---

## Commit & Git Issues

### Problem: "I made changes to multiple files, how do I commit?"

**Solution**: Use semantic commits for each stream:

```bash
# Stream 1: Types
git commit -m "feat(types): add cursor to provider union types"

# Stream 2: Data
git commit -m "feat(data): add cursor implementations for all 13 primitives"

# Stream 3: UI
git commit -m "feat(ui): update comparison table for 3-provider layout"

# Stream 4: Tests
git commit -m "test(e2e): update tests for 3-provider assertions"

# Stream 5: Integration
git commit -m "docs(app): update site copy to mention cursor"

# Stream 6: LLMs
git commit -m "docs(llms): regenerate with cursor provider data"
```

Use the [semantic-commit skill](../../semantic-commit) for help.

---

## Debugging Tips

### Verify all 13 primitives are complete

```bash
# Count provider entries in primitives.ts
grep "provider: 'cursor'" site/src/data/primitives.ts | wc -l
# Should be 13

# Count total primitives
grep "id: '" site/src/data/primitives.ts | wc -l
# Should be 13
```

`comparison.ts` and `providerProfiles.ts` derive their rows from `primitives.ts` at import time —
there is no separate row count or ID list to reconcile in either file. If TypeScript compiles
clean, the derived data is in sync by construction.

### Incorrect Support Levels for Provider

**When**: After implementing all streams, comparing against official docs

**Cause**: Support levels were assumed instead of verified against official provider documentation.

**Solution**:
1. Visit the provider's official documentation (cursor.com/docs, claude.ai, etc.)
2. For each of the 13 primitives, verify:
   - Is this feature officially supported?
   - Are there any limitations or workarounds?
   - What version/channel is it available in?
3. Update support levels based on actual documentation:
   - `full` - Natively supported, documented, core feature
   - `partial` - Works with limitations or workarounds
   - `diy` - Custom setup required, or not possible
4. Update `primitives.ts` only — `comparison.ts` and `providerProfiles.ts` derive from it
5. Regenerate llms-full.txt with updated data

**Real example**: Cursor Hooks support was initially missed. Verification against cursor.com/docs/agent/hooks showed full support was available.

---

### Missing File Tree Provider Tab

**When**: Provider shows in comparison table but not in File Tree component

**Cause**: Forgot to add provider to the `FileTree.tsx` providers array (Stream 3.2).

**Solution**: Edit `site/src/components/FileTree/FileTree.tsx`:

```typescript
const providers: { id: Provider; label: string; icon: string }[] = [
  { id: 'copilot', label: 'GitHub Copilot', icon: '🤖' },
  { id: 'claude', label: 'Claude Code', icon: '🧠' },
  { id: 'cursor', label: 'Cursor', icon: '➤' },  // Add this line
]
```

Without this, users can't switch between providers in the Interactive File Tree visualization.

---

### Visual test in browser

1. Run `npm run dev`
2. Go to `http://localhost:5173`
3. Scroll to "Provider Comparison" section
4. Verify:
   - All 3 provider columns visible
   - All 13 primitives listed
   - Support badges show correct colors
   - Click to expand shows all 3 provider details
   - Copy buttons work for each provider

---

## Getting Help

If you're stuck:

1. **Check this document** - Search for your error
2. **Check PATTERNS.md** - Review support levels and naming conventions
3. **Check EXAMPLES.md** - Find copy-paste templates for your situation
4. **Check PROCESS.md** - Re-read the step-by-step for that stream
5. **Run typecheck** - `npm run typecheck` shows all type errors
6. **Search the codebase** - Look at how other providers implemented it
7. **Test incrementally** - Add one stream at a time, test after each
