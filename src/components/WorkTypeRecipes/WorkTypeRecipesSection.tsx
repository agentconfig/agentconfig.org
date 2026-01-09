import { type ReactNode } from 'react'
import { recipes } from '@/data/recipes'
import { RecipeCard } from './RecipeCard'

export function WorkTypeRecipesSection(): ReactNode {
  return (
    <div>
      {/* Intro text */}
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Start with your task type, not your tool. Each recipe shows the recommended
        combination of primitives for common work patterns.
      </p>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
