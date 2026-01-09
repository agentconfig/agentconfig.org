import { test, expect } from '@playwright/test'

test.describe('Primitive Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Navigate to primitives section
    await page.getByRole('link', { name: 'Primitives' }).click()
  })

  test('should display category filter tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /All Primitives/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Instructions/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Execution/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Tools/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Safety/i })).toBeVisible()
  })

  test('should have All Primitives selected by default', async ({ page }) => {
    const allTab = page.getByRole('tab', { name: /All Primitives/i })
    await expect(allTab).toHaveAttribute('aria-selected', 'true')
  })

  test('should display primitive cards', async ({ page }) => {
    // Check for some known primitives
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Agent Mode' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Guardrails' })).toBeVisible()
  })

  test('should filter primitives by category', async ({ page }) => {
    // Click on Instructions category
    const instructionsTab = page.getByRole('tab', { name: /Instructions/i })
    await instructionsTab.click()
    await expect(instructionsTab).toHaveAttribute('aria-selected', 'true')

    // Should see instructions primitives
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Prompt Templates' })).toBeVisible()

    // Should NOT see execution primitives
    await expect(page.getByRole('heading', { name: 'Agent Mode' })).not.toBeVisible()
  })

  test('should filter to execution primitives', async ({ page }) => {
    const executionTab = page.getByRole('tab', { name: /Execution/i })
    await executionTab.click()

    // Should see execution primitives
    await expect(page.getByRole('heading', { name: 'Agent Mode' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Skills / Workflows' })).toBeVisible()

    // Should NOT see instructions primitives
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).not.toBeVisible()
  })

  test('should filter to safety primitives', async ({ page }) => {
    const safetyTab = page.getByRole('tab', { name: /Safety/i })
    await safetyTab.click()

    // Should see safety primitives
    await expect(page.getByRole('heading', { name: 'Guardrails' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Verification / Evals' })).toBeVisible()
  })

  test('should expand primitive card on click', async ({ page }) => {
    // Find a primitive card and click to expand
    const persistentInstructionsCard = page.getByRole('heading', { name: 'Persistent Instructions' }).locator('..')
    await persistentInstructionsCard.click()

    // Should show expanded content
    await expect(page.getByText(/What it is/i).first()).toBeVisible()
    await expect(page.getByText(/Use it when/i).first()).toBeVisible()
    await expect(page.getByText(/Prevents/i).first()).toBeVisible()
    await expect(page.getByText(/Combine with/i).first()).toBeVisible()
  })

  test('should show provider implementations when expanded', async ({ page }) => {
    // Expand a primitive card
    const card = page.getByRole('heading', { name: 'Persistent Instructions' }).locator('..')
    await card.click()

    // Should show implementation details
    await expect(page.getByText(/Implementation by provider/i)).toBeVisible()
    await expect(page.getByText(/GitHub Copilot/i).first()).toBeVisible()
    await expect(page.getByText(/Claude Code/i).first()).toBeVisible()
  })

  test('should show support badges', async ({ page }) => {
    // Expand a primitive card
    const card = page.getByRole('heading', { name: 'Persistent Instructions' }).locator('..')
    await card.click()

    // Should show support badge
    await expect(page.getByText('Full Support').first()).toBeVisible()
  })

  test('should show file locations', async ({ page }) => {
    // Expand a primitive card
    const card = page.getByRole('heading', { name: 'Persistent Instructions' }).locator('..')
    await card.click()

    // Should show file location
    await expect(page.getByText('.github/copilot-instructions.md')).toBeVisible()
    await expect(page.getByText('CLAUDE.md')).toBeVisible()
  })

  test('should collapse expanded card on second click', async ({ page }) => {
    // Expand a primitive card
    const card = page.getByRole('heading', { name: 'Persistent Instructions' }).locator('..')
    await card.click()

    // Verify expanded
    await expect(page.getByText(/What it is/i).first()).toBeVisible()

    // Click again to collapse
    await card.click()

    // Should no longer show expanded content
    await expect(page.getByText('Implementation by provider')).not.toBeVisible()
  })

  test('should return to all primitives when clicking All tab', async ({ page }) => {
    // Filter to safety
    await page.getByRole('tab', { name: /Safety/i }).click()
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).not.toBeVisible()

    // Click All
    await page.getByRole('tab', { name: /All Primitives/i }).click()

    // Should see all primitives again
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Guardrails' })).toBeVisible()
  })

  test('should show category counts in filter tabs', async ({ page }) => {
    // Check that tabs show counts (except All)
    await expect(page.getByRole('tab', { name: /Instructions.*\(4\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Execution.*\(3\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Tools.*\(3\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Safety.*\(2\)/i })).toBeVisible()
  })
})
