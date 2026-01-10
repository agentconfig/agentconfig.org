import { test, expect } from '@playwright/test'

test.describe('Provider Comparison', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Navigate to comparison section using nav link
    await page.getByLabel('Main navigation').getByRole('link', { name: 'Comparison' }).click()
  })

  test('should display comparison table', async ({ page }) => {
    // Table should be visible
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('should display table headers', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: /Primitive/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /GitHub Copilot/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Claude Code/i })).toBeVisible()
  })

  test('should display all primitives in the table', async ({ page }) => {
    const table = page.getByRole('table')
    // Check for primitive names in the table cells
    await expect(table.getByText('Persistent Instructions')).toBeVisible()
    await expect(table.getByText('Scope-Specific Instructions')).toBeVisible()
    await expect(table.getByText('Prompt Templates')).toBeVisible()
    await expect(table.getByText('Agent Mode')).toBeVisible()
    await expect(table.getByText('Skills / Workflows')).toBeVisible()
    await expect(table.getByText('Tool Integrations')).toBeVisible()
    await expect(table.getByText('Guardrails')).toBeVisible()
    await expect(table.getByText('Verification / Evals')).toBeVisible()
  })

  test('should display support level badges', async ({ page }) => {
    const table = page.getByRole('table')
    // Check for Full Support badges
    await expect(table.getByText('Full Support').first()).toBeVisible()
    // Check for Partial badges (some primitives have partial support)
    await expect(table.getByText('Partial').first()).toBeVisible()
  })

  test('should expand row on click to show details', async ({ page }) => {
    // Click on a table row (the tr element is clickable)
    const table = page.getByRole('table')
    const row = table.getByRole('row').filter({ hasText: 'Persistent Instructions' }).first()
    await row.click()

    // Should show expanded details with implementation info
    await expect(page.getByText('Repo instructions file')).toBeVisible()
    await expect(page.getByText('Project memory file')).toBeVisible()
  })

  test('should show file locations when expanded', async ({ page }) => {
    // Click on a table row
    const table = page.getByRole('table')
    const row = table.getByRole('row').filter({ hasText: 'Persistent Instructions' }).first()
    await row.click()

    // Should show file locations
    await expect(page.getByText('.github/copilot-instructions.md')).toBeVisible()
    await expect(page.getByText('CLAUDE.md').first()).toBeVisible()
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

    // Should have copy buttons
    const copyButtons = page.getByRole('button', { name: /Copy location/i })
    await expect(copyButtons.first()).toBeVisible()
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
