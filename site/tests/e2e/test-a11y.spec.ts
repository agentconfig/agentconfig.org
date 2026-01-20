import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Full Accessibility Check', () => {
  test('check home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const results = await new AxeBuilder({ page }).analyze()
    
    console.log('=== HOME PAGE VIOLATIONS ===')
    results.violations.forEach((v) => {
      console.log(`\n[${v.id}] ${v.impact}: ${v.description}`)
      console.log(`Help: ${v.helpUrl}`)
      v.nodes.forEach((node, i) => {
        console.log(`  ${i+1}. ${node.target.join(' > ')}`)
        console.log(`     HTML: ${node.html.substring(0, 200)}`)
      })
    })
    
    console.log(`\nTotal violations: ${results.violations.length}`)
    console.log('Violations by ID:', results.violations.map(v => v.id).join(', '))
  })
})
