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
    await expect(page.getByRole('heading', { name: 'Continue with an in-depth guide' })).toBeVisible()

    const sectionOrder = await page.locator('section[id]').evaluateAll((sections) =>
      sections.map((section) => section.id)
    )
    expect(sectionOrder.indexOf('file-tree')).toBeLessThan(sectionOrder.indexOf('comparison'))
    expect(sectionOrder.indexOf('comparison')).toBeLessThan(sectionOrder.indexOf('scope-model'))
    expect(sectionOrder.indexOf('scope-model')).toBeLessThan(sectionOrder.indexOf('explore-guides'))
  })

  test('should link to every in-depth guide from the overview', async ({ page }) => {
    await page.goto('/?provider=claude')

    const guideSection = page.locator('#explore-guides')
    const expectedGuides = [
      ['Agent Instructions', '/agents/?provider=claude'],
      ['Skills', '/skills/?provider=claude'],
      ['Lifecycle Hooks', '/hooks/?provider=claude'],
      ['MCP Tool Integrations', '/mcp/?provider=claude'],
      ['Install & Share', '/install/?provider=claude'],
      ['Provider Profiles', '/profiles/?provider=claude'],
    ] as const

    for (const [name, href] of expectedGuides) {
      await expect(guideSection.getByRole('heading', { name }).locator('..')).toHaveAttribute('href', href)
    }
  })
})
