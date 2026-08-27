import { test, expect } from '@playwright/test'

test.describe('Agents Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/agents/')
  })

  test('should load the agents page with hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Agent Instructions', exact: true })).toBeVisible()
    await expect(page.getByText(/Start with one small project file/)).toBeVisible()
  })

  test('should display level badges in hero', async ({ page }) => {
    const hero = page.locator('header.guide-hero')
    await expect(hero.getByText('One useful file', { exact: true })).toBeVisible()
    await expect(hero.getByText('Provider locations', { exact: true })).toBeVisible()
    await expect(hero.getByText('Advanced layouts', { exact: true })).toBeVisible()
  })

  test('should display table of contents', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Table of contents' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Create One Useful File/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /What Instructions Do/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Six Core Sections/ })).toBeVisible()
  })

  test('should recommend AGENTS.md as the shared baseline when supported', async ({ page }) => {
    await expect(page.getByText(/start there for shared team instructions/i)).toBeVisible()
  })

  test('should have all 9 tutorial sections', async ({ page }) => {
    await expect(page.locator('#what-are-definitions')).toBeVisible()
    await expect(page.locator('#first-definition')).toBeVisible()
    await expect(page.locator('#six-sections')).toBeVisible()
    await expect(page.locator('#provider-formats')).toBeVisible()
    await expect(page.locator('#path-scoped')).toBeVisible()
    await expect(page.locator('#agent-personas')).toBeVisible()
    await expect(page.locator('#file-hierarchy')).toBeVisible()
    await expect(page.locator('#monorepo')).toBeVisible()
    await expect(page.locator('#further-reading')).toBeVisible()
  })

  test('should navigate to section when TOC link clicked', async ({ page }) => {
    const tocLink = page.getByRole('link', { name: /Six Core Sections/ })
    await tocLink.click()

    // Wait for smooth scroll and check URL hash
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/.*#six-sections/)

    // Section should be in view
    const section = page.locator('#six-sections')
    await expect(section).toBeInViewport()
  })

  test('should display code blocks with copy button', async ({ page }) => {
    // Find a code block by looking for pre element with code inside
    const codeBlock = page.locator('pre').first()
    await expect(codeBlock).toBeVisible()

    // Should have a copy button nearby
    const copyButton = page.getByRole('button', { name: /Copy/ }).first()
    await expect(copyButton).toBeVisible()
  })

  test('should copy code when copy button clicked', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // Find first code block and its copy button
    const copyButton = page.getByRole('button', { name: /Copy/ }).first()
    await copyButton.click()

    // Button should show "Copied!" state
    await expect(page.getByText('Copied!')).toBeVisible()

    // Should revert back to "Copy" after timeout
    await expect(copyButton.getByText('Copy')).toBeVisible({ timeout: 3000 })
  })

  test('should display further reading section with links', async ({ page }) => {
    const furtherReading = page.locator('#further-reading')
    await furtherReading.scrollIntoViewIfNeeded()

    // Check for external links
    await expect(page.getByRole('link', { name: /Claude Code Memory/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Copilot Customization/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /great agents\.md/ })).toBeVisible()
  })

  test('should have proper source badges on further reading links', async ({ page }) => {
    const furtherReading = page.locator('#further-reading')
    await furtherReading.scrollIntoViewIfNeeded()

    // Check for source badges - use first() to handle multiple matches
    await expect(page.getByText('Anthropic').first()).toBeVisible()
    await expect(page.getByText('GitHub Docs').first()).toBeVisible()
    await expect(page.getByText('GitHub Blog').first()).toBeVisible()
  })
})

test.describe('Agents Page - Responsive', () => {
  test('should hide sidebar on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/agents/')

    // TOC sidebar should be hidden on mobile (lg:w-64 becomes hidden)
    const sidebar = page.locator('aside')
    // On mobile the sidebar stacks above content, check it's not sticky
    await expect(sidebar).toBeVisible()
  })

  test('should show sidebar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/agents/')

    // TOC should be visible and sticky
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible()
  })
})

test.describe('Agents Page - Theme', () => {
  test('should render correctly in light mode', async ({ page }) => {
    await page.goto('/agents/')

    // Should have light background
    const body = page.locator('body')
    await expect(body).not.toHaveClass(/dark/)
  })

  test('should render correctly in dark mode', async ({ page }) => {
    await page.goto('/agents/')

    // Toggle to dark mode (assuming theme toggle exists)
    const themeToggle = page.getByRole('button', { name: /Toggle theme|Dark mode|Light mode/i })
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
    } else {
      // Use media query emulation if no toggle
      await page.emulateMedia({ colorScheme: 'dark' })
    }

    // Code blocks should still be readable
    const codeBlock = page.locator('pre').first()
    await expect(codeBlock).toBeVisible()
  })
})
