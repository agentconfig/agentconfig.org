import { test, expect } from '@playwright/test'

test.describe('Scope Model', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('#scope-model').scrollIntoViewIfNeeded()
  })

  test('should display the scope model table', async ({ page }) => {
    await expect(page.locator('#scope-model').getByRole('table')).toBeVisible()
  })

  test('should display table headers', async ({ page }) => {
    const table = page.locator('#scope-model').getByRole('table')
    await expect(table.getByRole('columnheader', { name: 'Scope' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Common usage' })).toBeVisible()
  })

  test('should render all nine scope rows', async ({ page }) => {
    const table = page.locator('#scope-model').getByRole('table')
    await expect(table.getByRole('row')).toHaveCount(10) // 1 header row + 9 scope rows
  })

  test('should show key scope labels', async ({ page }) => {
    const table = page.locator('#scope-model').getByRole('table')
    await expect(table.getByText('Managed / organization')).toBeVisible()
    await expect(table.getByText('User', { exact: true })).toBeVisible()
    await expect(table.getByText('Repository', { exact: true })).toBeVisible()
    await expect(table.getByText('Local repository')).toBeVisible()
    await expect(table.getByText('Directory / path')).toBeVisible()
    await expect(table.getByText('Agent', { exact: true })).toBeVisible()
    await expect(table.getByText('Session', { exact: true })).toBeVisible()
    await expect(table.getByText('Turn', { exact: true })).toBeVisible()
    await expect(table.getByText('Tool invocation')).toBeVisible()
  })

  test('should note that scopes are not peer primitives', async ({ page }) => {
    await expect(page.getByText(/Scopes are not peer primitives/i)).toBeVisible()
  })
})
