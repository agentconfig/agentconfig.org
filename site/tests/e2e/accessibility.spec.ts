import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('home page should have no accessibility violations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Elevate AI Assistants' })).toBeVisible()

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

  test('hooks page should have no accessibility violations', async ({ page }) => {
    await page.goto('/hooks/')
    await expect(page.getByRole('heading', { name: 'Lifecycle Hooks' })).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })

  test('profiles page should have no accessibility violations', async ({ page }) => {
    await page.goto('/profiles/')
    await expect(page.getByRole('heading', { name: 'Provider Compatibility Profiles' })).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })
})
