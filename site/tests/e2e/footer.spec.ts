import { test, expect } from '@playwright/test'

test.describe('Footer', () => {
  test('should display correct footer text with agentconfig link', async ({ page }) => {
    await page.goto('/')

    // Check that the footer contains the correct text
    const footer = page.locator('footer')
    await expect(footer).toContainText('brought to you by agentconfig')

    // Check that the agentconfig link exists and has the correct href
    const agentconfigLink = footer.getByRole('link', { name: 'agentconfig' })
    await expect(agentconfigLink).toBeVisible()
    await expect(agentconfigLink).toHaveAttribute('href', 'https://github.com/agentconfig')
  })

  test('should have proper styling on footer link', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const agentconfigLink = footer.getByRole('link', { name: 'agentconfig' })
    
    // Check that the link has underline class
    await expect(agentconfigLink).toHaveClass(/underline/)
  })
})
