import { test, expect } from '@playwright/test'

test.describe('Work Type Recipes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Navigate to recipes section
    await page.getByRole('link', { name: 'Recipes' }).click()
  })

  test('should display all six recipe cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quick Answer' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Single File Code Change' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Multi-File Refactor' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Research & Synthesis' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Incident Triage' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Team-Scale Consistency' })).toBeVisible()
  })

  test('should display recipe icons', async ({ page }) => {
    // Check for emoji icons
    await expect(page.getByText('💬')).toBeVisible()
    await expect(page.getByText('📝')).toBeVisible()
    await expect(page.getByText('🔄')).toBeVisible()
    await expect(page.getByText('🔍')).toBeVisible()
    await expect(page.getByText('🚨')).toBeVisible()
    await expect(page.getByText('👥')).toBeVisible()
  })

  test('should display risk level badges', async ({ page }) => {
    await expect(page.getByText('Low Risk').first()).toBeVisible()
    await expect(page.getByText('Medium Risk').first()).toBeVisible()
    await expect(page.getByText('High Risk').first()).toBeVisible()
  })

  test('should display taglines for each recipe', async ({ page }) => {
    await expect(page.getByText('One-off explanations and questions')).toBeVisible()
    await expect(page.getByText('Write or modify code in one file')).toBeVisible()
    await expect(page.getByText('Large changes across multiple files')).toBeVisible()
    await expect(page.getByText('Docs, ADRs, and comparisons')).toBeVisible()
    await expect(page.getByText('Production debugging and response')).toBeVisible()
    await expect(page.getByText('Onboarding, standards, and repeated tasks')).toBeVisible()
  })

  test('should display primitive stack sections', async ({ page }) => {
    // Verify Primitive Stack headers are visible (one per recipe card)
    const primitiveStackHeaders = page.getByText('Primitive Stack')
    await expect(primitiveStackHeaders).toHaveCount(6)
  })

  test('should display primitive names with reasons', async ({ page }) => {
    // Check for specific primitive + reason combinations
    await expect(page.getByText(/Sets tone and constraints for consistent responses/)).toBeVisible()
    await expect(page.getByText(/Enables multi-step execution with planning/)).toBeVisible()
    await expect(page.getByText(/Follows a proven refactor playbook/)).toBeVisible()
  })

  test('should display avoid warnings', async ({ page }) => {
    // Check that avoid sections are visible
    await expect(page.getByText(/Avoid:.*Keep it simple/i)).toBeVisible()
    await expect(page.getByText(/Avoid:.*Always run tests/i)).toBeVisible()
    await expect(page.getByText(/Avoid:.*Work incrementally/i)).toBeVisible()
  })

  test('should show optional primitives with label', async ({ page }) => {
    // Quick Answer has Structured Output as optional
    const quickAnswerCard = page.locator('article, div').filter({ hasText: 'Quick Answer' }).first()
    await expect(quickAnswerCard.getByText('(optional)')).toBeVisible()
  })

  test('should display intro text', async ({ page }) => {
    await expect(page.getByText(/Start with your task type, not your tool/i)).toBeVisible()
  })

  test('should display primitive reasons', async ({ page }) => {
    // Check that reasons are shown
    await expect(page.getByText('Sets tone and constraints for consistent responses')).toBeVisible()
    await expect(page.getByText('Enables multi-step execution with planning')).toBeVisible()
  })
})
