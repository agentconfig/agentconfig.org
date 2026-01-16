import { test, expect } from '@playwright/test'

test.describe('Primitive Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to primitives section
    await page.locator('#primitives').scrollIntoViewIfNeeded()
  })

  test('should display category filter tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /All Primitives/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Capability/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Customization/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Control/i })).toBeVisible()
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
    // Click on Customization category
    const customizationTab = page.getByRole('tab', { name: /Customization/i })
    await customizationTab.click()
    await expect(customizationTab).toHaveAttribute('aria-selected', 'true')

    // Should see customization primitives
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Slash Commands' })).toBeVisible()

    // Should NOT see capability primitives
    await expect(page.getByRole('heading', { name: 'Agent Mode' })).not.toBeVisible()
  })

  test('should filter to capability primitives', async ({ page }) => {
    const capabilityTab = page.getByRole('tab', { name: /Capability/i })
    await capabilityTab.click()

    // Should see capability primitives
    await expect(page.getByRole('heading', { name: 'Agent Mode' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Skills / Workflows' })).toBeVisible()

    // Should NOT see customization primitives
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).not.toBeVisible()
  })

  test('should filter to control primitives', async ({ page }) => {
    const controlTab = page.getByRole('tab', { name: /Control/i })
    await controlTab.click()

    // Should see control primitives
    await expect(page.getByRole('heading', { name: 'Permissions & Guardrails' })).toBeVisible()
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
    // Filter to control
    await page.getByRole('tab', { name: /Control/i }).click()
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).not.toBeVisible()

    // Click All
    await page.getByRole('tab', { name: /All Primitives/i }).click()

    // Should see all primitives again
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Permissions & Guardrails' })).toBeVisible()
  })

  test('should show category counts in filter tabs', async ({ page }) => {
    // Check that tabs show counts (except All) - 3 capability, 4 customization, 4 control
    await expect(page.getByRole('tab', { name: /Capability.*\(3\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Customization.*\(4\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Control.*\(4\)/i })).toBeVisible()
  })
})
