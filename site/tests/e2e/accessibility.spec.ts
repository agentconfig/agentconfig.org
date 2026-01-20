import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('home page should have no accessibility violations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Master AI Assistants' })).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })

  test('agents page should have no accessibility violations', async ({ page }) => {
    await page.goto('/agents/')
    await expect(page.getByRole('heading', { name: 'AGENTS.md Specification' })).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })

  test('skills page should have no accessibility violations', async ({ page }) => {
    await page.goto('/skills/')
    await expect(page.getByRole('heading', { name: 'Building Agent Skills' })).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })

  test('mcp page should have no accessibility violations', async ({ page }) => {
    await page.goto('/mcp/')
    await expect(page.getByRole('heading', { name: 'MCP Tool Integrations' })).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })
})
