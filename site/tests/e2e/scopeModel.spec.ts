import { test, expect } from '@playwright/test'

test.describe('Scope Model', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('#scope-model').scrollIntoViewIfNeeded()
  })

  test('should display the three-stage scope ladder', async ({ page }) => {
    const section = page.locator('#scope-model')
    await expect(section.getByRole('heading', { name: 'Broad defaults' })).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Project context' })).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Live execution' })).toBeVisible()
  })

  test('should show key scope labels', async ({ page }) => {
    const section = page.locator('#scope-model')
    await expect(section.getByText('Managed / organization')).toBeVisible()
    await expect(section.getByText('User', { exact: true })).toBeVisible()
    await expect(section.getByText('Repository', { exact: true })).toBeVisible()
    await expect(section.getByText('Local repository')).toBeVisible()
    await expect(section.getByText('Directory / path')).toBeVisible()
    await expect(section.getByText('Agent', { exact: true })).toBeVisible()
    await expect(section.getByText('Session', { exact: true })).toBeVisible()
    await expect(section.getByText('Turn', { exact: true })).toBeVisible()
    await expect(section.getByText('Tool invocation')).toBeVisible()
  })

  test('should explain who each scope affects', async ({ page }) => {
    const section = page.locator('#scope-model')
    await expect(section.getByText('Everyone in an organization')).toBeVisible()
    await expect(section.getByText('Everyone in one repository')).toBeVisible()
    await expect(section.getByText('One action')).toBeVisible()
  })

  test('should note that scopes are not peer primitives', async ({ page }) => {
    await expect(page.getByText(/Scopes are not peer primitives/i)).toBeVisible()
  })
})
