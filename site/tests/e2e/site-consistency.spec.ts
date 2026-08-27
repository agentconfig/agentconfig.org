import { expect, test } from '@playwright/test'

const pages = ['/', '/skills/', '/agents/', '/hooks/', '/mcp/', '/profiles/']

test.describe('Site consistency', () => {
  for (const path of pages) {
    test(`${path} has no page-level mobile overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(path)

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))

      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
    })
  }

  test('generated guide order matches the rendered learning progression', async ({ request }) => {
    const expectedOrder: Record<string, string[]> = {
      '/skills.md': ['### 1. Create One Small Skill', '### 2. Understanding the Spec'],
      '/agents.md': ['### 1. Create One Useful Instruction File', '### 2. What Agent Instructions Do'],
      '/mcp.md': ['### 1. Connect One Server', '### 2. What is MCP?', '### 10. Further Reading'],
    }

    for (const [path, headings] of Object.entries(expectedOrder)) {
      const response = await request.get(path)
      expect(response.ok()).toBe(true)
      const content = await response.text()
      let previousIndex = -1

      for (const heading of headings) {
        const index = content.indexOf(heading)
        expect(index, `${heading} should exist in ${path}`).toBeGreaterThan(previousIndex)
        previousIndex = index
      }

      if (path === '/agents.md') {
        expect(content).toContain('### 4. Add Your User Preferences')
        expect(content).toContain('$HOME/.copilot/copilot-instructions.md')
        expect(content).toContain('start there for shared team instructions')
      }

      if (path === '/mcp.md') {
        expect(content).toContain('**Cursor:**')
        expect(content).toContain('**OpenAI Codex:**')
        expect(content).toContain('| Project | `.cursor/mcp.json` | Team (shared) |')
        expect(content).toContain('| Project | `.codex/config.toml` | Team (shared) |')
      }
    }
  })

  test('an unknown provider shows a clear state instead of falling back', async ({ page }) => {
    await page.goto('/hooks/?provider=unknown')

    await expect(page.getByRole('combobox', { name: 'Provider' })).toHaveValue('')
    await expect(page.locator('#first-provider-hook').getByRole('status')).toHaveText(
      'Choose a supported provider to see this example.'
    )
    await expect(page.locator('#first-provider-hook').getByRole('tab', { selected: true })).toHaveCount(0)
  })

  test('renders and synchronizes selection when browser storage is blocked', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new DOMException('Storage is blocked', 'SecurityError')
      }
      Storage.prototype.setItem = () => {
        throw new DOMException('Storage is blocked', 'SecurityError')
      }
    })

    await page.goto('/agents/')
    await expect(page.getByRole('heading', { name: 'Agent Instructions', exact: true })).toBeVisible()

    await page.getByRole('combobox', { name: 'Provider' }).selectOption('cursor')
    await expect(page).toHaveURL(/.*[?&]provider=cursor(?:&|#|$)/)
    await expect(page.locator('#first-definition').getByRole('tab', { name: 'Cursor', exact: true })).toHaveAttribute('aria-selected', 'true')
  })

  test('footer profile link preserves the selected provider', async ({ page }) => {
    await page.goto('/agents/?provider=cursor')

    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Provider profiles' })).toHaveAttribute(
      'href',
      '/profiles/?provider=cursor'
    )
  })

  test('legacy hook fragments take precedence over stored selection', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('agentconfig-provider', 'codex')
    })
    await page.goto('/hooks/#first-claude-hook')

    await expect(page.locator('#first-provider-hook').getByRole('tab', { name: 'Claude Code', exact: true })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  test('MCP installation and scope details cover every provider', async ({ page }) => {
    const expectedScopes = {
      copilot: '.vscode/mcp.json',
      claude: '.mcp.json (project root)',
      cursor: '.cursor/mcp.json',
      codex: '.codex/config.toml',
    }

    for (const [provider, location] of Object.entries(expectedScopes)) {
      await page.goto(`/mcp/?provider=${provider}`)
      await expect(page.locator('#configuration-scopes').getByRole('tabpanel')).toContainText(location)
      await expect(page.locator('#installing-servers').getByRole('tabpanel')).toContainText(
        provider === 'claude' ? 'claude mcp add' : location
      )
    }
  })
})
