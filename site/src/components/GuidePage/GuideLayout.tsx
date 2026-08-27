import type { ComponentChildren, VNode } from 'preact'
import { TableOfContents } from '@/components/TableOfContents'
import type { TocItem } from '@/components/TableOfContents'

export interface GuideLayoutProps {
  readonly tocItems: readonly TocItem[]
  readonly children: ComponentChildren
}

export function GuideLayout({ tocItems, children }: GuideLayoutProps): VNode {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="shrink-0 lg:w-[260px]">
          <div className="lg:sticky lg:top-24">
            <TableOfContents items={tocItems} />
          </div>
        </aside>
        <div className="min-w-0 max-w-3xl flex-1">
          <article className="prose prose-neutral max-w-none dark:prose-invert">
            {children}
          </article>
        </div>
      </div>
    </div>
  )
}
