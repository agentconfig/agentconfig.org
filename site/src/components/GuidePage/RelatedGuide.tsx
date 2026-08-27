import type { VNode } from 'preact'
import { ArrowRight } from 'lucide-preact'
import { providerAwareHref } from '@/lib/providerSelection'
import { useSelectedProvider } from '@/components/Navigation/useSelectedProvider'

export interface RelatedGuideProps {
  readonly title: string
  readonly description: string
  readonly href: string
}

export function RelatedGuide({ title, description, href }: RelatedGuideProps): VNode {
  const selectedProvider = useSelectedProvider()

  return (
    <div className="not-prose my-12 rounded-xl border border-primary/30 bg-primary/5 p-5">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <a
        href={providerAwareHref(href, selectedProvider)}
        className="mt-4 flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        Open Install & Share
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  )
}
