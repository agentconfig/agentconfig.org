import { test, expect } from '@playwright/test'

test.describe('Provider Compatibility Profiles Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profiles/')
  })

  test('should load the profiles page with hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Provider Compatibility Profiles' })).toBeVisible()
    await expect(page.getByText(/per-provider view of every primitive/i)).toBeVisible()
  })

  test('should show a tab per provider', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /GitHub Copilot/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Claude Code/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Cursor/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /OpenAI Codex/ })).toBeVisible()
  })

  test('should default to the first provider tab selected', async ({ page }) => {
    const firstTab = page.getByRole('tab', { name: /GitHub Copilot/ })
    await expect(firstTab).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText(/primitives tracked/).first()).toBeVisible()
  })

  test('should switch provider tabs with arrow keys', async ({ page }) => {
    const copilotTab = page.getByRole('tab', { name: /GitHub Copilot/ })
    const claudeTab = page.getByRole('tab', { name: /Claude Code/ })

    await copilotTab.focus()
    await expect(copilotTab).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('ArrowRight')
    await expect(claudeTab).toHaveAttribute('aria-selected', 'true')
    await expect(claudeTab).toBeFocused()
  })

  test('should show category-grouped primitive tables with support badges', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Instructions', exact: true })).toBeVisible()
    await expect(page.getByText('Full Support').first()).toBeVisible()
  })

  test('should link to provider documentation when a source citation exists', async ({ page }) => {
    const docsLink = page.getByRole('link', { name: /Docs/ }).first()
    await expect(docsLink).toBeVisible()
    await expect(docsLink).toHaveAttribute('target', '_blank')
    await expect(docsLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('should show the same primitive across every provider tab', async ({ page }) => {
    for (const providerName of ['GitHub Copilot', 'Claude Code', 'Cursor', 'OpenAI Codex']) {
      await page.getByRole('tab', { name: new RegExp(providerName) }).click()
      await expect(page.getByRole('tabpanel')).toContainText('Persistent Instructions')
    }
  })

  test('renders representative content on mobile without page-level overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/profiles/')

    await expect(page.getByRole('heading', { name: 'Provider Compatibility Profiles' })).toBeVisible()
    await expect(page.getByRole('tab', { name: /GitHub Copilot/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /OpenAI Codex/ })).toBeVisible()

    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('renders in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('heading', { name: 'Provider Compatibility Profiles' })).toBeVisible()
    await expect(page.getByRole('tab', { name: /GitHub Copilot/ })).toBeVisible()
  })
})
