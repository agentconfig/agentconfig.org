import type { VNode, ComponentChildren } from 'preact'
import { cn } from '@/lib/utils'

export interface SectionProps {
  /** Section ID for anchor linking */
  id: string
  /** Section title */
  title: string
  /** Section description */
  description: string
  /** Section content */
  children: ComponentChildren
  /** Additional CSS classes */
  className?: string
}

export function Section({
  id,
  title,
  description,
  children,
  className,
}: SectionProps): VNode {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('py-16 md:py-24 scroll-mt-20', className)}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2
            id={`${id}-title`}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  )
}
