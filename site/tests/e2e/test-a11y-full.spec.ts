import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Test all pages
const pages = [
  { path: '/', name: 'Home' },
  { path: '/agents/', name: 'Agents' },
  { path: '/skills/', name: 'Skills' },
  { path: '/mcp/', name: 'MCP' },
]

for (const pageInfo of pages) {
  test(`check ${pageInfo.name} page`, async ({ page }) => {
    await page.goto(pageInfo.path)
    await page.waitForLoadState('networkidle')
    
    const results = await new AxeBuilder({ page }).analyze()
    
    console.log(`\n=== ${pageInfo.name.toUpperCase()} PAGE VIOLATIONS ===`)
    results.violations.forEach((v) => {
      console.log(`\n[${v.id}] ${v.impact}: ${v.description}`)
      v.nodes.slice(0, 3).forEach((node, i) => {
        console.log(`  ${i+1}. ${node.target.join(' > ')}`)
      })
      if (v.nodes.length > 3) {
        console.log(`  ... and ${v.nodes.length - 3} more`)
      }
    })
    
    console.log(`\nViolations: ${results.violations.map(v => v.id).join(', ') || 'None'}`)
  })
}
