import { test, expect } from '@playwright/test'

test.describe('Skills Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/skills/')
  })

  test('should load the skills page with hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Building Agent Skills', exact: true })).toBeVisible()
  })

  test('should display all concept sections in sidebar', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Understanding the Spec' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Progressive Disclosure' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Composability' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'When to Use What' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Keeping Skills Lean' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Script Usage Patterns' })).toBeVisible()
  })

  test('should display example sections in sidebar', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Who Am I' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Voice & Tone' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Executive Summary' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Weekly Snippets' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Visual UI QA' })).toBeVisible()
  })

  test('should have Script Usage Patterns section with correct content', async ({ page }) => {
    const section = page.locator('#script-usage-patterns')
    await expect(section).toBeVisible()
    
    await expect(page.getByRole('heading', { name: 'Script Usage Patterns', exact: true })).toBeVisible()
    await expect(page.getByText('When and why to use scripts for deterministic operations.')).toBeVisible()
    await expect(page.getByText(/Scripts excel at tasks requiring.*deterministic, consistent output/)).toBeVisible()
  })

  test('should display config file modification pattern', async ({ page }) => {
    const tocLink = page.getByRole('link', { name: 'Script Usage Patterns' })
    await tocLink.click()
    
    await page.waitForTimeout(500)
    
    await expect(page.getByRole('heading', { name: 'The Config File Modification Pattern' })).toBeVisible()
    await expect(page.getByText(/Agent parses the requirement/)).toBeVisible()
    await expect(page.getByText(/Agent calls a script with parameters/)).toBeVisible()
    await expect(page.getByText(/Script handles the modification/)).toBeVisible()
    await expect(page.getByText(/Agent verifies the result/)).toBeVisible()
  })

  test('should display YAML and JSON specific concerns', async ({ page }) => {
    await page.getByRole('link', { name: 'Script Usage Patterns' }).click()
    await page.waitForTimeout(500)
    
    await expect(page.getByRole('heading', { name: 'Why Scripts Beat Agent-Generated Code for Configs' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'YAML-Specific Concerns' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'JSON-Specific Concerns' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'The Determinism Principle' })).toBeVisible()
  })

  test('should display practical examples table', async ({ page }) => {
    await page.getByRole('link', { name: 'Script Usage Patterns' }).click()
    await page.waitForTimeout(500)
    
    await expect(page.getByRole('heading', { name: 'When to Use Scripts vs Agent Code' })).toBeVisible()
    await expect(page.getByText(/Modifying config files/)).toBeVisible()
    await expect(page.getByText(/Writing new application code/)).toBeVisible()
  })

  test('should display three practical examples', async ({ page }) => {
    await page.getByRole('link', { name: 'Script Usage Patterns' }).click()
    await page.waitForTimeout(500)
    
    await expect(page.getByRole('heading', { name: 'Practical Examples' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Example 1: Kubernetes Manifest Updates' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Example 2: Package.json Dependency Management' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Example 3: Environment-Specific Config Generation' })).toBeVisible()
  })

  test('should display best practices section', async ({ page }) => {
    await page.getByRole('link', { name: 'Script Usage Patterns' }).click()
    await page.waitForTimeout(500)
    
    await expect(page.getByRole('heading', { name: 'Best Practices' })).toBeVisible()
    await expect(page.getByText(/Use established tools/)).toBeVisible()
    await expect(page.getByText(/Validate after modification/)).toBeVisible()
    await expect(page.getByText(/Make scripts idempotent/)).toBeVisible()
  })

  test('should navigate between sections using sidebar', async ({ page }) => {
    // Click on Script Usage Patterns
    await page.getByRole('link', { name: 'Script Usage Patterns' }).click()
    await page.waitForTimeout(500)
    
    // Then click on another section to verify navigation works
    await page.getByRole('link', { name: 'Keeping Skills Lean' }).click()
    await page.waitForTimeout(500)
  })

  test('should display all sections in correct order', async ({ page }) => {
    await expect(page.locator('#understanding-the-spec')).toBeVisible()
    await expect(page.locator('#progressive-disclosure')).toBeVisible()
    await expect(page.locator('#composability')).toBeVisible()
    await expect(page.locator('#when-to-use-what')).toBeVisible()
    await expect(page.locator('#keeping-skills-lean')).toBeVisible()
    await expect(page.locator('#script-usage-patterns')).toBeVisible()
  })

  test('should have Further Reading section', async ({ page }) => {
    await expect(page.locator('#further-reading')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Further Reading' })).toBeVisible()
  })
})
