import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display site title in navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'agentconfig.org' })).toBeVisible()
  })

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } })

    test('should display all navigation links', async ({ page }) => {
      const nav = page.getByLabel('Main navigation')
      await expect(nav.getByRole('link', { name: 'Overview' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Skills' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Agents' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Hooks' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'MCP' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Profiles' })).toHaveCount(0)
      await expect(nav.getByRole('combobox', { name: 'Provider' })).toHaveValue('')
    })

    test('should navigate to Skills page', async ({ page }) => {
      const navLink = page.getByLabel('Main navigation').getByRole('link', { name: 'Skills' })
      await navLink.click()

      // Should navigate to /skills/
      await expect(page).toHaveURL(/\/skills\/?/)
      await expect(page.getByRole('heading', { name: 'Building Agent Skills' })).toBeVisible()
    })

    test('should navigate to Agents page', async ({ page }) => {
      const navLink = page.getByLabel('Main navigation').getByRole('link', { name: 'Agents' })
      await navLink.click()

      // Should navigate to /agents/
      await expect(page).toHaveURL(/\/agents\/?/)
      await expect(page.getByRole('heading', { name: 'Agent Definitions', exact: true })).toBeVisible()
    })

    test('should navigate to Hooks page', async ({ page }) => {
      const navLink = page.getByLabel('Main navigation').getByRole('link', { name: 'Hooks' })
      await navLink.click()

      // Should navigate to /hooks/
      await expect(page).toHaveURL(/\/hooks\/?/)
      await expect(page.getByRole('heading', { name: 'Lifecycle Hooks', exact: true })).toBeVisible()
    })

    test('should select a provider and carry it into site navigation', async ({ page }) => {
      const nav = page.getByLabel('Main navigation')
      await nav.getByRole('combobox', { name: 'Provider' }).selectOption('cursor')

      await expect(page).toHaveURL(/.*[?&]provider=cursor(?:&|#|$)/)
      await nav.getByRole('link', { name: 'Hooks' }).click()
      await expect(page).toHaveURL(/\/hooks\/\?provider=cursor/)
      await expect(page.locator('#first-provider-hook').getByRole('tab', { name: 'Cursor', exact: true })).toHaveAttribute('aria-selected', 'true')
    })

    test('should navigate back to Overview from Skills', async ({ page }) => {
      // Go to Skills page first
      await page.goto('/skills/')

      // Click Overview link
      const navLink = page.getByLabel('Main navigation').getByRole('link', { name: 'Overview' })
      await navLink.click()

      // Should be back on homepage
      await expect(page).toHaveURL(/\/$/)
    })
  })

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should display menu button', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    })

    test('should open mobile menu when menu button is clicked', async ({ page }) => {
      const menuButton = page.getByRole('button', { name: 'Open menu' })
      await menuButton.click()

      await expect(page.getByRole('link', { name: 'Skills' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Agents' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Hooks' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Profiles' })).toHaveCount(0)
      await expect(page.getByRole('combobox', { name: 'Provider' })).toHaveValue('')
      await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
    })

    test('should close mobile menu when nav link is clicked', async ({ page }) => {
      const menuButton = page.getByRole('button', { name: 'Open menu' })
      await menuButton.click()

      const navLink = page.getByRole('link', { name: 'Skills' })
      await navLink.click()

      // Menu should close and navigate
      await expect(page).toHaveURL(/\/skills\/?/)
    })

    test('should expose the provider chooser inside the mobile menu', async ({ page }) => {
      await page.getByRole('button', { name: 'Open menu' }).click()
      const providerChooser = page.getByRole('combobox', { name: 'Provider' })

      await providerChooser.selectOption('claude')

      await expect(providerChooser).toHaveValue('claude')
      await expect(page).toHaveURL(/.*[?&]provider=claude(?:&|#|$)/)
      await page.getByRole('link', { name: 'Hooks' }).click()
      await expect(page).toHaveURL(/\/hooks\/\?provider=claude/)
    })
  })
})
