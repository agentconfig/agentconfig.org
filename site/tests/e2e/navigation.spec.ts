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

      await expect(page.getByRole('menuitem', { name: 'Skills' })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'Agents' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
    })

    test('should close mobile menu when nav link is clicked', async ({ page }) => {
      const menuButton = page.getByRole('button', { name: 'Open menu' })
      await menuButton.click()

      const navLink = page.getByRole('menuitem', { name: 'Skills' })
      await navLink.click()

      // Menu should close and navigate
      await expect(page).toHaveURL(/\/skills\/?/)
    })
  })
})
