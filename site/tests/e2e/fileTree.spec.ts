import { test, expect } from '@playwright/test'

test.describe('File Tree', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to file tree section
    await page.locator('#file-tree').scrollIntoViewIfNeeded()
  })

  test('should display provider tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /GitHub Copilot/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Claude Code/i })).toBeVisible()
  })

  test('should have Copilot tab selected by default', async ({ page }) => {
    const copilotTab = page.getByRole('tab', { name: /GitHub Copilot/i })
    await expect(copilotTab).toHaveAttribute('aria-selected', 'true')
  })

  test('should switch between providers', async ({ page }) => {
    // Click Claude tab
    const claudeTab = page.getByRole('tab', { name: /Claude Code/i })
    await claudeTab.click()
    await expect(claudeTab).toHaveAttribute('aria-selected', 'true')

    // Claude tree should show CLAUDE.md with Project Memory badge (root level)
    await expect(page.getByRole('treeitem', { name: 'CLAUDE.md Project Memory' })).toBeVisible()

    // Switch back to Copilot
    const copilotTab = page.getByRole('tab', { name: /GitHub Copilot/i })
    await copilotTab.click()
    await expect(copilotTab).toHaveAttribute('aria-selected', 'true')

    // Copilot tree should show .github folder
    await expect(page.getByRole('treeitem', { name: /\.github/i })).toBeVisible()
  })

  test('should display root folder', async ({ page }) => {
    await expect(page.getByRole('treeitem', { name: /my-project/i })).toBeVisible()
  })

  test('should expand and collapse folders', async ({ page }) => {
    // The .github folder should be visible (my-project is expanded by default)
    const githubFolder = page.getByRole('treeitem', { name: /\.github/ })
    await expect(githubFolder).toBeVisible()

    // Click on the my-project folder text to collapse it
    // We use getByText to click specifically on the folder name, not its children
    await page.getByText('my-project', { exact: true }).click()

    // .github should no longer be visible
    await expect(githubFolder).not.toBeVisible()

    // Click to expand again
    await page.getByText('my-project', { exact: true }).click()
    await expect(githubFolder).toBeVisible()
  })

  test('should show file detail placeholder when no file selected', async ({ page }) => {
    await expect(page.getByText(/Click a file in the tree to see its details/i)).toBeVisible()
  })

  test('should display file details when clicking a file', async ({ page }) => {
    // First expand .github folder (only root is expanded by default)
    const githubFolder = page.getByRole('treeitem', { name: /\.github/ })
    await githubFolder.click()

    // Now copilot-instructions.md should be visible
    // The file treeitem includes its badge text in the accessible name
    const instructionsFile = page.getByRole('treeitem', { name: /copilot-instructions\.md.*Repo Instructions/i })
    await instructionsFile.click()

    // Detail panel should show file info
    await expect(page.getByRole('heading', { name: /copilot-instructions\.md/i })).toBeVisible()
    await expect(page.getByText(/What goes here/i)).toBeVisible()
    await expect(page.getByText(/When loaded/i)).toBeVisible()
    await expect(page.getByText(/Example content/i)).toBeVisible()
  })

  test('should show load order in file details', async ({ page }) => {
    // First expand .github folder
    const githubFolder = page.getByRole('treeitem', { name: /\.github/ })
    await githubFolder.click()

    // Click on a file with the badge
    const instructionsFile = page.getByRole('treeitem', { name: /copilot-instructions\.md.*Repo Instructions/i })
    await instructionsFile.click()

    // Should show load order
    await expect(page.getByText(/Load Order:/i)).toBeVisible()
  })

  test('should have copy button for example content', async ({ page }) => {
    // First expand .github folder
    const githubFolder = page.getByRole('treeitem', { name: /\.github/ })
    await githubFolder.click()

    // Click on a file
    const instructionsFile = page.getByRole('treeitem', { name: /copilot-instructions\.md.*Repo Instructions/i })
    await instructionsFile.click()

    // Copy button should be visible
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible()
  })

  test('should display badges on files with details', async ({ page }) => {
    // First expand .github folder (only root is expanded by default)
    const githubFolder = page.getByRole('treeitem', { name: /\.github/ })
    await githubFolder.click()

    // Files with details should have badges visible
    // copilot-instructions.md has "Repo Instructions" badge
    await expect(page.getByRole('treeitem', { name: /copilot-instructions\.md.*Repo Instructions/i })).toBeVisible()
  })

  test('should navigate with keyboard', async ({ page }) => {
    // Focus on the my-project treeitem
    const myProject = page.getByRole('treeitem', { name: /my-project/i })
    await myProject.focus()

    // Press Enter to toggle - this should work since we're focusing the treeitem directly
    await page.keyboard.press('Enter')

    // .github should no longer be visible
    const githubFolder = page.getByRole('treeitem', { name: /\.github/ })
    await expect(githubFolder).not.toBeVisible()

    // Press Enter again to expand
    await page.keyboard.press('Enter')
    await expect(githubFolder).toBeVisible()
  })
})

test.describe('File Tree - Claude Provider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to file tree section
    await page.locator('#file-tree').scrollIntoViewIfNeeded()
    // Switch to Claude
    await page.getByRole('tab', { name: /Claude Code/i }).click()
  })

  test('should show Claude-specific file structure', async ({ page }) => {
    // Should show CLAUDE.md with Project Memory badge at root level (in project config section)
    await expect(page.getByRole('treeitem', { name: 'CLAUDE.md Project Memory' })).toBeVisible()

    // Should show .claude folder in both global and project sections
    // Check that there are two .claude folders (one global, one project)
    const claudeFolders = page.getByRole('treeitem', { name: /^\.claude$/i })
    await expect(claudeFolders).toHaveCount(2)

    // Verify the global section shows ~/.claude (use exact match to avoid matching .claude.json)
    await expect(page.getByLabel('Contents of ~').getByRole('treeitem', { name: '.claude', exact: true })).toBeVisible()

    // Verify the project section shows .claude
    await expect(page.getByLabel('Contents of my-project').getByRole('treeitem', { name: '.claude', exact: true })).toBeVisible()
  })

  test('should display Claude file details when clicked', async ({ page }) => {
    // Click on CLAUDE.md (root level with Project Memory badge)
    const claudeMdFile = page.getByRole('treeitem', { name: 'CLAUDE.md Project Memory' })
    await claudeMdFile.click()

    // Should show details - check for the heading specifically
    await expect(page.getByRole('heading', { name: /CLAUDE\.md/i })).toBeVisible()
    // Check that the detail panel shows the label badge
    await expect(page.locator('.scroll-mt-24').getByText('Project Memory')).toBeVisible()
  })
})
