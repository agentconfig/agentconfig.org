import { test, expect } from '@playwright/test'

test.describe('Hooks Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hooks/')
  })

  test('loads the hooks page with hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Lifecycle Hooks', exact: true })).toBeVisible()
    await expect(page.getByText('Start with one small hook for Copilot, Claude Code, Cursor, or Codex')).toBeVisible()
    await expect(page.getByRole('group', { name: 'Hooks provider' })).toBeVisible()
  })

  test('synchronizes provider selection through the URL', async ({ page }) => {
    const headerSelector = page.getByRole('group', { name: 'Hooks provider' })
    await headerSelector.getByRole('button', { name: 'Cursor', exact: true }).click()

    await expect(page).toHaveURL(/.*[?&]provider=cursor(?:&|#|$)/)
    await expect(headerSelector.getByRole('button', { name: 'Cursor', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#first-provider-hook').getByRole('tab', { name: 'Cursor', exact: true })).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#lifecycle-model').getByRole('tab', { name: 'Cursor', exact: true })).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#provider-panels').getByRole('tab', { name: 'Cursor', exact: true })).toHaveAttribute('aria-selected', 'true')

    await page.reload()
    await expect(headerSelector.getByRole('button', { name: 'Cursor', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#first-provider-hook').getByText('.cursor/hooks.json', { exact: true }).last()).toBeVisible()
  })

  test('shows the lifecycle and provider mappings', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Lifecycle Events/ })).toBeVisible()
    const lifecycleSection = page.locator('#lifecycle-model')

    await expect(lifecycleSection.getByText('A typical agent session')).toBeVisible()
    await expect(lifecycleSection.getByRole('heading', { name: 'Begin', exact: true })).toBeVisible()
    await expect(lifecycleSection.getByRole('heading', { name: 'Act', exact: true })).toBeVisible()
    await expect(lifecycleSection.getByRole('heading', { name: 'Finish', exact: true })).toBeVisible()
    await expect(lifecycleSection.getByRole('tablist', { name: 'Lifecycle provider event names' })).toBeVisible()
    await expect(lifecycleSection.locator('[role="tabpanel"]:visible').getByText('preToolUse', { exact: true })).toHaveCSS('font-family', /mono/i)

    await lifecycleSection.getByRole('tab', { name: 'Claude Code', exact: true }).click()
    await expect(lifecycleSection.locator('[role="tabpanel"]:visible').getByText('PreToolUse', { exact: true })).toBeVisible()

    await lifecycleSection.getByRole('tab', { name: 'Cursor', exact: true }).click()
    await expect(lifecycleSection.locator('[role="tabpanel"]:visible').getByText('beforeSubmitPrompt', { exact: true })).toBeVisible()
    await expect(lifecycleSection.locator('[role="tabpanel"]:visible').getByText('preCompact', { exact: true })).toBeVisible()

    await lifecycleSection.getByRole('tab', { name: 'OpenAI Codex', exact: true }).click()
    await expect(lifecycleSection.locator('[role="tabpanel"]:visible').getByText('PreCompact, PostCompact', { exact: true })).toBeVisible()
  })

  test('shows provider details as tabs with code-styled paths', async ({ page }) => {
    await page.getByRole('link', { name: /5\. Providers/ }).click()
    const providerSection = page.locator('#provider-panels')

    await expect(providerSection.getByRole('heading', { name: 'GitHub Copilot', exact: true })).toBeVisible()
    await expect(providerSection.getByText('.github/hooks/*.json')).toHaveCSS('font-family', /mono/i)

    await providerSection.getByRole('tab', { name: 'Claude Code', exact: true }).click()
    await expect(providerSection.getByRole('heading', { name: 'Claude Code', exact: true })).toBeVisible()
    await expect(providerSection.getByText('.claude/settings.local.json')).toHaveCSS('font-family', /mono/i)

    await providerSection.getByRole('tab', { name: 'Cursor', exact: true }).click()
    await expect(providerSection.getByRole('heading', { name: 'Cursor', exact: true })).toBeVisible()
    await expect(providerSection.locator('[role="tabpanel"]:visible').getByText('.cursor/hooks.json', { exact: true })).toHaveCSS('font-family', /mono/i)

    await providerSection.getByRole('tab', { name: 'OpenAI Codex', exact: true }).click()
    await expect(providerSection.getByRole('heading', { name: 'OpenAI Codex', exact: true })).toBeVisible()
  })

  test('starts with a provider-specific working example', async ({ page }) => {
    const firstSection = page.locator('article section').first()
    await expect(firstSection).toHaveAttribute('id', 'first-provider-hook')
    await expect(firstSection.getByRole('heading', { name: '1. Block One Risky Command' })).toBeVisible()
    await expect(page.getByText('.github/hooks/pre-tool-use.json')).toBeVisible()
    await firstSection.getByRole('tab', { name: 'Claude Code', exact: true }).click()
    await expect(firstSection.getByText('.claude/settings.json', { exact: true }).last()).toBeVisible()
    await firstSection.getByRole('tab', { name: 'Cursor', exact: true }).click()
    await expect(firstSection.getByText('.cursor/hooks.json', { exact: true }).last()).toBeVisible()
    await expect(firstSection.getByText('.cursor/hooks/policy.mjs', { exact: true }).last()).toBeVisible()
    await firstSection.getByRole('tab', { name: 'OpenAI Codex', exact: true }).click()
    await expect(firstSection.getByText('.codex/hooks.json', { exact: true }).last()).toBeVisible()
  })

  test('includes fixture testing and safety guidance', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '7. Keep Integrations Safe' })).toBeVisible()
    await expect(page.getByText('Shell injection:')).toBeVisible()
    await expect(page.getByRole('heading', { name: '8. Test the Hook' })).toBeVisible()
    await expect(page.getByText('policy-core.test.ts')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Use instructions for judgment' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Use MCP for a new tool' })).toBeVisible()
  })

  test('navigates to sections from the table of contents', async ({ page }) => {
    await page.getByRole('link', { name: /Reuse Policy Logic/ }).click()
    await expect(page).toHaveURL(/.*#policy-core/)
    await expect(page.locator('#policy-core')).toBeInViewport()
  })

  test('renders representative content on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/hooks/')

    await expect(page.getByRole('heading', { name: 'Lifecycle Hooks', exact: true })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Table of contents' })).toBeVisible()
    await expect(page.getByText('Copilot timeouts:')).toBeVisible()
  })

  test('renders code blocks in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('heading', { name: '6. Reuse Policy Logic' })).toBeVisible()
    await expect(page.locator('pre').first()).toBeVisible()
  })

  test('syntax-highlights code blocks via Shiki', async ({ page }) => {
    const highlighted = page.locator('.shiki-container pre.shiki').first()
    await expect(highlighted).toBeVisible()
    // Shiki emits per-span inline color styles driven by CSS custom
    // properties; confirm at least one token actually carries color info
    // rather than falling back to unstyled plain text.
    const tokenStyle = await highlighted.locator('span[style]').first().getAttribute('style')
    expect(tokenStyle).toContain('--shiki-light')
    await expect(highlighted).toHaveCSS('padding', '16px')
    await expect(highlighted.locator('span[style]').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    const container = highlighted.locator('xpath=..')
    const lastToken = highlighted.locator('span[style]').last()
    await container.evaluate((element) => { element.scrollLeft = element.scrollWidth })
    const preBox = await highlighted.boundingBox()
    const tokenBox = await lastToken.boundingBox()
    if (preBox == null || tokenBox == null) {
      throw new Error('Highlighted code block did not produce measurable boxes')
    }
    const rightPadding = preBox.x + preBox.width - (tokenBox.x + tokenBox.width)
    expect(rightPadding).toBeGreaterThanOrEqual(15)
  })

  test('switches provider tabs with arrow keys', async ({ page }) => {
    await page.getByRole('link', { name: /Block One Risky Command/ }).click()
    const firstSection = page.locator('#first-provider-hook')
    const copilotTab = firstSection.getByRole('tab', { name: 'GitHub Copilot', exact: true })
    const claudeTab = firstSection.getByRole('tab', { name: 'Claude Code', exact: true })

    await copilotTab.focus()
    await expect(copilotTab).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('ArrowRight')
    await expect(page).toHaveURL(/.*[?&]provider=claude(?:&|#|$)/)
    await expect(claudeTab).toHaveAttribute('aria-selected', 'true')
    await expect(claudeTab).toBeFocused()
    await expect(firstSection.getByText('.claude/settings.json', { exact: true }).last()).toBeVisible()
    await expect(page.getByRole('group', { name: 'Hooks provider' }).getByRole('button', { name: 'Claude Code', exact: true })).toHaveAttribute('aria-pressed', 'true')
  })

  test('preserves legacy provider anchors and stable tab panel relationships', async ({ page }) => {
    await page.goto('/hooks/?from=legacy#first-claude-hook')

    const firstSection = page.locator('#first-provider-hook')
    const claudeTab = firstSection.getByRole('tab', { name: 'Claude Code', exact: true })
    await expect(claudeTab).toHaveAttribute('aria-selected', 'true')

    for (const tab of await firstSection.getByRole('tab').all()) {
      const panelId = await tab.getAttribute('aria-controls')
      expect(panelId).not.toBeNull()
      await expect(page.locator(`#${panelId ?? ''}`)).toHaveCount(1)
    }
  })
})
