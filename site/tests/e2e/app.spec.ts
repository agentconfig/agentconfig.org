import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Configure AI Coding Assistants/)
  })

  test('should render the main heading', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Configure AI Coding Assistants' })).toBeVisible()
  })

  test('should display all core sections', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Configuration Layers', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Choose the Right Scope' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Interactive File Tree' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Provider Comparison' })).toBeVisible()

    const sectionOrder = await page.locator('section[id]').evaluateAll((sections) =>
      sections.map((section) => section.id)
    )
    expect(sectionOrder.indexOf('file-tree')).toBeLessThan(sectionOrder.indexOf('comparison'))
    expect(sectionOrder.indexOf('comparison')).toBeLessThan(sectionOrder.indexOf('scope-model'))
  })
})
