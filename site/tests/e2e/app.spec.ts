import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Elevate AI Coding Assistants/)
  })

  test('should render the main heading', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Elevate AI Assistants' })).toBeVisible()
  })

  test('should display all core sections', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Configuration Layers', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Scope Model' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Interactive File Tree' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Provider Comparison' })).toBeVisible()
  })
})
