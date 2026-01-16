import { useState, useEffect, useRef } from 'preact/hooks'

export interface UseActiveSectionOptions {
  /** IDs of sections to observe */
  readonly sectionIds: readonly string[]
  /** Root margin for intersection observer (default: '-20% 0px -70% 0px') */
  readonly rootMargin?: string
  /** Threshold for intersection (default: 0) */
  readonly threshold?: number
}

/**
 * Hook that tracks which section is currently in view using Intersection Observer.
 * Returns the ID of the currently active section.
 */
export function useActiveSection({
  sectionIds,
  rootMargin = '-20% 0px -70% 0px',
  threshold = 0,
}: UseActiveSectionOptions): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(() => {
    // Initialize with first section
    return sectionIds.length > 0 ? (sectionIds[0] ?? null) : null
  })
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const intersecting = entries.find((entry) => entry.isIntersecting)
        if (intersecting) {
          setActiveSection(intersecting.target.id)
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [sectionIds, rootMargin, threshold])

  return activeSection
}
