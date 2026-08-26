import { test, expect } from '@playwright/test'

test.describe('Primitive Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to primitives section
    await page.locator('#primitives').scrollIntoViewIfNeeded()
  })

  test('should display category filter tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /All Primitives/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Instructions/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Procedures/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Control & Approval/i })).toBeVisible()
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
    // Click on Instructions layer
    const instructionsTab = page.getByRole('tab', { name: /Instructions/i })
    await instructionsTab.click()
    await expect(instructionsTab).toHaveAttribute('aria-selected', 'true')

    // Should see instruction primitives
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Directory / Path Scope Instructions' })).toBeVisible()

    // Should NOT see procedures primitives
    await expect(page.getByRole('heading', { name: 'Slash Commands' })).not.toBeVisible()
  })

  test('should filter to procedures primitives', async ({ page }) => {
    const proceduresTab = page.getByRole('tab', { name: /Procedures/i })
    await proceduresTab.click()

    // Should see procedures primitives
    await expect(page.getByRole('heading', { name: 'Skills / Workflows' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Slash Commands' })).toBeVisible()

    // Should NOT see instruction primitives
    await expect(page.getByRole('heading', { name: 'Agent Mode' })).not.toBeVisible()
  })

  test('should filter to delegation primitives', async ({ page }) => {
    const delegationTab = page.getByRole('tab', { name: /Delegation/i })
    await delegationTab.click()

    // Should see delegation primitives
    await expect(page.getByRole('heading', { name: 'Agent Mode' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Custom Agents' })).toBeVisible()

    // Should NOT see instruction primitives
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).not.toBeVisible()
  })

  test('should filter to control and approval primitives', async ({ page }) => {
    const controlTab = page.getByRole('tab', { name: /Control & Approval/i })
    await controlTab.click()

    // Should see control & approval primitives
    await expect(page.getByRole('heading', { name: 'Permissions & Guardrails' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Runtime Sandbox' })).toBeVisible()
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
    const cardButton = page.getByRole('heading', { name: 'Persistent Instructions' }).locator('xpath=ancestor::button[1]')
    await cardButton.click()

    // Should show file location
    await expect(page.getByText('AGENTS.md or .github/copilot-instructions.md').first()).toBeVisible()
    await expect(page.getByText('./CLAUDE.md, ./.claude/CLAUDE.md').first()).toBeVisible()
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
    // Filter to control & approval
    await page.getByRole('tab', { name: /Control & Approval/i }).click()
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).not.toBeVisible()

    // Click All
    await page.getByRole('tab', { name: /All Primitives/i }).click()

    // Should see all primitives again
    await expect(page.getByRole('heading', { name: 'Persistent Instructions' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Permissions & Guardrails' })).toBeVisible()
  })

  test('should show category counts in filter tabs', async ({ page }) => {
    // Check that every layer tab shows its actual count (except All).
    await expect(page.getByRole('tab', { name: /Instructions.*\(3\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Procedures.*\(2\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Tools & Context.*\(1\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Delegation.*\(2\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Control & Approval.*\(3\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Memory & State.*\(0\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Distribution.*\(1\)/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Verification & Observability.*\(1\)/i })).toBeVisible()
  })
})
