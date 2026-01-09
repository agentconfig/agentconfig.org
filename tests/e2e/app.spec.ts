import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/AI Primitives Guide/)
  })

  test('should render the main heading', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'AI Primitives Guide' })).toBeVisible()
  })

  test('should display all four section placeholders', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Interactive File Tree' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'AI Primitives', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Work Type Recipes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Provider Comparison' })).toBeVisible()
  })
})
