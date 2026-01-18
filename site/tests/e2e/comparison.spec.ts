import { test, expect } from '@playwright/test'

test.describe('Provider Comparison', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to comparison section
    await page.locator('#comparison').scrollIntoViewIfNeeded()
  })

  test('should display comparison table', async ({ page }) => {
    // Table should be visible
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('should display table headers', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: /Primitive/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /GitHub Copilot/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Claude Code/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /OpenAI Codex/i })).toBeVisible()
  })

  test('should display all primitives in the table', async ({ page }) => {
    const table = page.getByRole('table')
    // Check for primitive names in the table cells
    await expect(table.getByText('Persistent Instructions')).toBeVisible()
    await expect(table.getByText('Global Instructions')).toBeVisible()
    await expect(table.getByText('Path-Scoped Rules')).toBeVisible()
    await expect(table.getByText('Slash Commands')).toBeVisible()
    await expect(table.getByText('Agent Mode')).toBeVisible()
    await expect(table.getByText('Skills / Workflows')).toBeVisible()
    await expect(table.getByText('Tool Integrations (MCP)')).toBeVisible()
    await expect(table.getByText('Custom Agents')).toBeVisible()
    await expect(table.getByText('Permissions & Guardrails')).toBeVisible()
    await expect(table.getByText('Lifecycle Hooks')).toBeVisible()
    await expect(table.getByText('Verification / Evals')).toBeVisible()
  })

  test('should display support level badges', async ({ page }) => {
    const table = page.getByRole('table')
    // Check for Full Support badges
    await expect(table.getByText('Full Support').first()).toBeVisible()
    // 11 primitives x 3 providers with various support levels
    // Copilot: 8 full, 1 none (Hooks), 2 diy (Path-Scoped, N/A on one)
    // Claude: 11 full
    // Codex: 7 full, 4 partial
    // Total Full Support: 8 + 11 + 7 = 26
    const fullSupportBadges = table.getByText('Full Support')
    await expect(fullSupportBadges).toHaveCount(26)
    // Check for Partial badges (Codex has 4)
    const partialBadges = table.getByText('Partial')
    await expect(partialBadges).toHaveCount(4)
    // Hooks has "Not Available" on Copilot
    await expect(table.getByText('Not Available')).toBeVisible()
  })

  test('should expand row on click to show details', async ({ page }) => {
    // Click on a table row (the tr element is clickable)
    const table = page.getByRole('table')
    const row = table.getByRole('row').filter({ hasText: 'Persistent Instructions' }).first()
    await row.click()

    // Should show expanded details with implementation info
    await expect(page.getByText('Repo instructions file')).toBeVisible()
    await expect(page.getByText('Project memory file with @imports')).toBeVisible()
    await expect(page.getByText('Project instructions via AGENTS.md')).toBeVisible()
  })

  test('should show file locations when expanded', async ({ page }) => {
    // Click on a table row
    const table = page.getByRole('table')
    const row = table.getByRole('row').filter({ hasText: 'Persistent Instructions' }).first()
    await row.click()

    // Should show file locations
    await expect(page.getByText('.github/copilot-instructions.md')).toBeVisible()
    await expect(page.getByText('CLAUDE.md').first()).toBeVisible()
    await expect(page.getByText('AGENTS.md (project-level)')).toBeVisible()
  })

  test('should collapse row on second click', async ({ page }) => {
    const table = page.getByRole('table')
    const row = table.getByRole('row').filter({ hasText: 'Persistent Instructions' }).first()

    // Click to expand
    await row.click()

    // Verify expanded
    await expect(page.getByText('Repo instructions file')).toBeVisible()

    // Click to collapse
    await row.click()

    // Should no longer show expanded content
    await expect(page.getByText('Repo instructions file')).not.toBeVisible()
  })

  test('should display legend', async ({ page }) => {
    await expect(page.getByText(/Support levels:/i)).toBeVisible()
    await expect(page.getByText(/First-class feature/i)).toBeVisible()
    await expect(page.getByText(/Possible with workarounds/i)).toBeVisible()
  })

  test('should display help text', async ({ page }) => {
    await expect(page.getByText(/Click any row to see implementation details/i)).toBeVisible()
  })

  test('should have copy buttons in expanded row', async ({ page }) => {
    const table = page.getByRole('table')
    const row = table.getByRole('row').filter({ hasText: 'Persistent Instructions' }).first()

    // Click to expand
    await row.click()

    // Should have copy buttons (one for each provider: Copilot, Claude, Codex)
    const copyButtons = page.getByRole('button', { name: /Copy location/i })
    await expect(copyButtons).toHaveCount(3)
  })

  test('should only expand one row at a time', async ({ page }) => {
    const table = page.getByRole('table')

    // Click first row
    const firstRow = table.getByRole('row').filter({ hasText: 'Persistent Instructions' }).first()
    await firstRow.click()
    await expect(page.getByText('Repo instructions file')).toBeVisible()

    // Click second row
    const secondRow = table.getByRole('row').filter({ hasText: 'Agent Mode' }).first()
    await secondRow.click()

    // First row should collapse
    await expect(page.getByText('Repo instructions file')).not.toBeVisible()
    // Second row should be expanded
    await expect(page.getByText('Agent mode in Copilot Chat')).toBeVisible()
  })
})
