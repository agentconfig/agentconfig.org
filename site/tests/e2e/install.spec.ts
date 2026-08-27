import { test, expect } from '@playwright/test'

test.describe('Install and Share guide', () => {
  test('teaches the installation layers and smallest useful choice', async ({ page }) => {
    await page.goto('/install/')

    await expect(page.getByRole('heading', { name: 'Packaging, Installing, and Sharing Agent Configuration' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '2. Understand the layers' })).toBeVisible()
    await expect(page.getByText('Package format', { exact: true })).toBeVisible()
    await expect(page.getByText('Registry or marketplace', { exact: true })).toBeVisible()
    await expect(page.getByText('Installer or package manager', { exact: true })).toBeVisible()
    await expect(page.getByText('Agent runtime', { exact: true })).toBeVisible()
    await expect(page.getByText('Choose the smallest thing that solves the sharing problem.')).toBeVisible()
  })

  test('distinguishes Agent Plugins from APM', async ({ page }) => {
    await page.goto('/install/')

    await expect(page.getByRole('heading', { name: '4. Package portable components' })).toBeVisible()
    await expect(page.getByText('Agent Plugins 1.0 standardizes the portable package layout.')).toBeVisible()
    await expect(page.getByRole('heading', { name: '6. Make project setup reproducible with APM' })).toBeVisible()
    await expect(page.getByText('APM manages installation and integrity; it does not control the agent at runtime.')).toBeVisible()
  })

  test('shows provider-specific installation guidance from the provider query', async ({ page }) => {
    await page.goto('/install/?provider=cursor')

    await expect(page.locator('#native-install-cursor-tab')).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText('Open Customize, find the plugin, select Install, and choose project or user scope.')).toBeVisible()
  })

  test('covers trust and lifecycle before recommending installation', async ({ page }) => {
    await page.goto('/install/')

    await expect(page.getByRole('heading', { name: '8. Review trust and provenance' })).toBeVisible()
    await expect(page.getByText('Executable hooks and scripts')).toBeVisible()
    await expect(page.getByText('Transitive dependencies')).toBeVisible()
    await expect(page.getByText('Version or content pin')).toBeVisible()
    await expect(page.getByRole('heading', { name: '9. Manage the lifecycle' })).toBeVisible()
    await expect(page.getByText('Remove or roll back')).toBeVisible()
  })

  test('links to primary standards and tool documentation', async ({ page }) => {
    await page.goto('/install/')

    await expect(page.getByRole('link', { name: 'Agent Plugins specification' })).toHaveAttribute('href', 'https://agent-plugins.org/specification')
    await expect(page.getByRole('link', { name: 'Agent Package Manager' })).toHaveAttribute('href', 'https://microsoft.github.io/apm/')
    await expect(page.getByRole('link', { name: 'Agent Skills specification' })).toHaveAttribute('href', 'https://agentskills.io/specification')
  })
})
