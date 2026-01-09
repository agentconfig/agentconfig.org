import { type ReactNode } from 'react'
import { AlertTriangle, Check, CircleDot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Recipe, riskLevelColors, riskLevelLabels } from '@/data/recipes'

export interface RecipeCardProps {
  /** The recipe to display */
  recipe: Recipe
  /** Additional CSS classes */
  className?: string | undefined
}

export function RecipeCard({ recipe, className }: RecipeCardProps): ReactNode {
  const requiredPrimitives = recipe.primitives.filter((p) => p.required)
  const optionalPrimitives = recipe.primitives.filter((p) => !p.required)

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card overflow-hidden',
        'flex flex-col h-full',
        className
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-secondary/30">
        <div className="flex items-start gap-3">
          <span className="text-3xl" role="img" aria-hidden="true">
            {recipe.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground">
                {recipe.name}
              </h3>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  riskLevelColors[recipe.riskLevel]
                )}
              >
                {riskLevelLabels[recipe.riskLevel]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {recipe.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-5">
        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {recipe.description}
        </p>

        {/* Primitives stack */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Primitive Stack
          </h4>
          <div className="space-y-2">
            {requiredPrimitives.map((primitive) => (
              <div
                key={primitive.id}
                className="flex items-start gap-2 text-sm"
              >
                <Check
                  className="h-4 w-4 mt-0.5 text-emerald-500 dark:text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <span className="font-medium text-foreground">
                    {primitive.name}
                  </span>
                  <span className="text-muted-foreground">
                    {' — '}{primitive.reason}
                  </span>
                </div>
              </div>
            ))}
            {optionalPrimitives.map((primitive) => (
              <div
                key={primitive.id}
                className="flex items-start gap-2 text-sm"
              >
                <CircleDot
                  className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <span className="font-medium text-foreground">
                    {primitive.name}
                  </span>
                  <span className="text-muted-foreground">
                    {' — '}{primitive.reason}
                  </span>
                  <span className="text-xs ml-1 text-muted-foreground/70">
                    (optional)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid section */}
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
          <div className="flex items-start gap-2 text-sm">
            <AlertTriangle
              className="h-4 w-4 mt-0.5 text-amber-500 dark:text-amber-400 shrink-0"
              aria-hidden="true"
            />
            <div>
              <span className="font-medium text-foreground">Avoid: </span>
              <span className="text-muted-foreground">{recipe.avoid}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
