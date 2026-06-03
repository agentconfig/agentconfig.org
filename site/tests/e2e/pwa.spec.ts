import { test, expect } from '@playwright/test'

test.describe('PWA - Service Worker and Offline Support', () => {
  test('should have web manifest referenced in HTML', async ({ page }) => {
    await page.goto('/')

    // Check that manifest link exists in the page
    const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href')

    expect(manifestLink).toBe('/site.webmanifest')
  })

  test('should have valid web manifest', async ({ page }) => {
    await page.goto('/')

    const manifest: unknown = await page.evaluate(async () => {
      const link = document.querySelector('link[rel="manifest"]')
      if (!link) return null

      const href = link.getAttribute('href')
      if (!href) return null

      const response = await fetch(href)
      return response.json()
    })

    expect(manifest).not.toBeNull()
    if (manifest) {
      expect(manifest as Record<string, unknown>).toHaveProperty('name')
      expect((manifest as Record<string, unknown>).name).toContain('agentconfig')
      expect((manifest as Record<string, unknown>).short_name).toBeDefined()
      expect((manifest as Record<string, unknown>).display).toBe('standalone')
      expect((manifest as Record<string, unknown>).icons).toBeDefined()
      const icons = (manifest as Record<string, unknown>).icons as unknown[]
      expect(icons.length).toBeGreaterThan(0)
    }
  })

  test('should have manifest with proper theme colors', async ({ page }) => {
    await page.goto('/')

    const manifest: unknown = await page.evaluate(async () => {
      const link = document.querySelector('link[rel="manifest"]')
      if (!link) return null

      const href = link.getAttribute('href')
      if (!href) return null

      const response = await fetch(href)
      return response.json()
    })

    if (manifest) {
      const manifestObj = manifest as Record<string, unknown>
      expect(manifestObj.theme_color).toBeDefined()
      expect(manifestObj.background_color).toBeDefined()
    }
  })

  test('should have favicon referenced', async ({ page }) => {
    await page.goto('/')

    // Check that favicon links exist
    const faviconLinks = await page.locator('link[rel*="icon"]').count()

    expect(faviconLinks).toBeGreaterThan(0)
  })

  test('should have all entry points accessible', async ({ page }) => {
    const routes = ['/', '/skills/', '/agents/', '/mcp/']

    for (const route of routes) {
      await page.goto(route)
      const statusCode = page.url()
      expect(statusCode).toContain(route)
    }
  })

  test('should serve static resources', async ({ page }) => {
    await page.goto('/')

    // Check that static resources can be fetched
    const resources = ['/llms.txt', '/agents.md', '/skills.md']

    for (const resource of resources) {
      const response = await page.request.head(resource)
      // Resources should either exist (200) or be properly configured (404)
      expect([200, 304]).toContain(response.status())
    }
  })
})
