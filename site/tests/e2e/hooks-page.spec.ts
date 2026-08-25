import { test, expect } from '@playwright/test'

test.describe('Hooks Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hooks/')
  })

  test('loads the hooks page with hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Lifecycle Hooks', exact: true })).toBeVisible()
    await expect(page.getByText('Build deterministic automation around agent lifecycle events')).toBeVisible()
  })

  test('shows the lifecycle and provider mappings', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Lifecycle Model/ })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'preToolUse', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'PreToolUse' }).first()).toBeVisible()
    await expect(page.getByRole('cell', { name: 'PostCompact' })).toBeVisible()
  })

  test('shows Copilot, Claude, and Codex provider panels', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'GitHub Copilot', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Claude Code', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'OpenAI Codex', exact: true })).toBeVisible()
    await expect(page.getByText('.github/hooks/*.json')).toBeVisible()
    await expect(page.getByText('.claude/settings.local.json')).toBeVisible()
  })

  test('includes fixture testing and safety guidance', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '8. Safe Integrations' })).toBeVisible()
    await expect(page.getByText('Shell injection:')).toBeVisible()
    await expect(page.getByRole('heading', { name: '9. Testing Hooks' })).toBeVisible()
    await expect(page.getByText('policy-core.test.ts')).toBeVisible()
  })

  test('navigates to sections from the table of contents', async ({ page }) => {
    await page.getByRole('link', { name: /Policy Core Pattern/ }).click()
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/.*#policy-core/)
    await expect(page.locator('#policy-core')).toBeInViewport()
  })
})
