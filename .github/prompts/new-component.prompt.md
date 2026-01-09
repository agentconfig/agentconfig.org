---
name: New Component
description: Template for creating a new React component
---

# New Component Prompt

Create a new React component following the project's component-builder conventions.

## Required Information

Please provide:
1. **Component name**: (e.g., `FileTreeNode`, `PrimitiveCard`)
2. **Purpose**: What does this component do?
3. **Props needed**: What data/callbacks does it need?
4. **Children**: Does it accept children?
5. **Variants**: Any visual variants (e.g., expanded/collapsed, active/inactive)?

## Output Structure

Create the following files:

```
src/components/{ComponentName}/
├── index.tsx
└── {ComponentName}.tsx
```

## Template

### index.tsx
```tsx
export { {ComponentName} } from './{ComponentName}'
export type { {ComponentName}Props } from './{ComponentName}'
```

### {ComponentName}.tsx
```tsx
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface {ComponentName}Props {
  /** TODO: Add prop descriptions */
  className?: string
}

export function {ComponentName}({
  className,
}: {ComponentName}Props): ReactNode {
  return (
    <div className={cn('', className)}>
      {/* TODO: Implement component */}
    </div>
  )
}
```

## Checklist

After creating the component:
- [ ] TypeScript types are complete with JSDoc comments
- [ ] Uses Tailwind for styling
- [ ] Uses `cn()` for className merging
- [ ] Mobile-first responsive
- [ ] Theme-aware (uses CSS variables)
- [ ] Accessible (semantic HTML, ARIA if needed)
- [ ] Under 150 lines
- [ ] Named export from index.tsx

## Example Usage

When I say "Create a FileTreeNode component that displays a file or folder with an expand/collapse toggle", you should:

1. Create `src/components/FileTreeNode/index.tsx`
2. Create `src/components/FileTreeNode/FileTreeNode.tsx` with:
   - Props: `name`, `type` (file|folder), `isExpanded`, `onToggle`, `children`
   - Styling for file vs folder icons
   - Expand/collapse animation
   - Proper accessibility attributes
