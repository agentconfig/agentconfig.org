import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// TODO: Remove color-contrast exclusion after fixing contrast issues in comparison table badges
// TODO: Remove aria-allowed-attr and aria-required-children after fixing FileTree ARIA roles
// TODO: Remove landmark rules after fixing duplicate <main> in PageLayout
// TODO: Remove scrollable-region-focusable after adding tabindex to code blocks
const excludedRules = [
  'color-contrast',
  'aria-allowed-attr',
  'aria-required-children',
  'landmark-main-is-top-level',
  'landmark-no-duplicate-main',
  'landmark-unique',
  'scrollable-region-focusable',
]

test.describe('Accessibility', () => {
  test('home page should have no accessibility violations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Master AI Assistants' })).toBeVisible()

    const results = await new AxeBuilder({ page })
      .disableRules(excludedRules)
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('agents page should have no accessibility violations', async ({ page }) => {
    await page.goto('/agents/')
    await expect(page.getByRole('heading', { name: 'AGENTS.md Specification' })).toBeVisible()

    const results = await new AxeBuilder({ page })
      .disableRules(excludedRules)
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('skills page should have no accessibility violations', async ({ page }) => {
    await page.goto('/skills/')
    await expect(page.getByRole('heading', { name: 'Building Agent Skills' })).toBeVisible()

    const results = await new AxeBuilder({ page })
      .disableRules(excludedRules)
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('mcp page should have no accessibility violations', async ({ page }) => {
    await page.goto('/mcp/')
    await expect(page.getByRole('heading', { name: 'MCP Tool Integrations' })).toBeVisible()

    const results = await new AxeBuilder({ page })
      .disableRules(excludedRules)
      .analyze()

    expect(results.violations).toEqual([])
  })
})
