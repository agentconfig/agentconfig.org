import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { cn } from '@/lib/utils'
import { primitives, categories, type CategoryId } from '@/data/primitives'
import { PrimitiveCard } from './PrimitiveCard'

export function PrimitiveCardsSection(): VNode {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')

  const filteredPrimitives = activeCategory === 'all'
    ? primitives
    : primitives.filter((p) => p.category === activeCategory)

  return (
    <div>
      {/* Category filter */}
      <div className="mb-8">
        <div
          role="tablist"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              role="tab"
              aria-selected={activeCategory === category.id}
              onClick={() => { setActiveCategory(category.id) }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {category.name}
              {category.id !== 'all' && (
                <span className="ml-2 opacity-70">
                  ({primitives.filter((p) => p.category === category.id).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Primitives grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrimitives.map((primitive) => (
          <PrimitiveCard key={primitive.id} primitive={primitive} />
        ))}
      </div>

      {/* Empty state */}
      {filteredPrimitives.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No primitives found in this category.
        </div>
      )}
    </div>
  )
}
