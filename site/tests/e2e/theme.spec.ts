import { test, expect } from '@playwright/test'

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('theme')
    })
    await page.reload()
  })

  test('should display theme toggle button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /switch to (light|dark) mode/i })).toBeVisible()
  })

  test('should toggle from light to dark mode', async ({ page }) => {
    // Emulate light mode system preference
    await page.emulateMedia({ colorScheme: 'light' })
    await page.reload()

    // Should start in light mode
    await expect(page.locator('html')).toHaveClass(/light/)

    // Click toggle
    const toggle = page.getByRole('button', { name: /switch to dark mode/i })
    await toggle.click()

    // Should now be in dark mode
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('should toggle from dark to light mode', async ({ page }) => {
    // Emulate dark mode system preference
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()

    // Should start in dark mode
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Click toggle
    const toggle = page.getByRole('button', { name: /switch to light mode/i })
    await toggle.click()

    // Should now be in light mode
    await expect(page.locator('html')).toHaveClass(/light/)
  })

  test('should persist theme choice after reload', async ({ page }) => {
    // Start in light mode
    await page.emulateMedia({ colorScheme: 'light' })
    await page.reload()

    // Toggle to dark
    const toggle = page.getByRole('button', { name: /switch to dark mode/i })
    await toggle.click()

    await expect(page.locator('html')).toHaveClass(/dark/)

    // Reload the page
    await page.reload()

    // Should still be in dark mode
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})
