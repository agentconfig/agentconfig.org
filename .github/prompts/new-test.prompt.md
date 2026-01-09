---
name: New Test
description: Template for creating Playwright E2E tests
---

# New Test Prompt

Create Playwright E2E tests following the project's tester conventions.

## Required Information

Please provide:
1. **Feature to test**: (e.g., "navigation", "file tree expand/collapse")
2. **User interactions**: What actions should be tested?
3. **Expected outcomes**: What should happen after each action?
4. **Edge cases**: Any error states or boundary conditions?

## Output Location

```
tests/e2e/{feature}.spec.ts
```

## Template

```typescript
import { test, expect } from '@playwright/test'

test.describe('{Feature Name}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should {expected behavior}', async ({ page }) => {
    // Arrange
    const element = page.getByRole('...', { name: '...' })

    // Act
    await element.click()

    // Assert
    await expect(...).toBeVisible()
  })
})
```

## Locator Priority

Use locators in this order of preference:
1. `getByRole()` - most resilient
2. `getByLabel()` / `getByPlaceholder()` - for forms
3. `getByText()` - for static text
4. `getByTestId()` - when others don't work
5. `locator()` with CSS - last resort

## Test Scenarios to Consider

### Happy Path
- Standard user flow works correctly

### Responsive
```typescript
test.describe('Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })
  // mobile-specific tests
})
```

### Theme
```typescript
test.describe('Dark mode', () => {
  test.use({ colorScheme: 'dark' })
  // dark mode tests
})
```

### Accessibility
- Keyboard navigation works
- Focus states are visible
- ARIA attributes are correct

## Checklist

After creating tests:
- [ ] Uses resilient locators (role preferred)
- [ ] Each test is independent
- [ ] Test names describe expected behavior
- [ ] Uses auto-waiting assertions
- [ ] No hardcoded waits
- [ ] Covers responsive if relevant
- [ ] Covers both themes if relevant

## Example Usage

When I say "Write tests for the theme toggle", you should create tests that:

1. Verify toggle button is visible
2. Verify clicking toggles from light to dark
3. Verify clicking again toggles from dark to light
4. Verify theme persists after page reload (if applicable)
5. Test keyboard accessibility (Enter/Space activates)
6. Test at mobile and desktop viewports
