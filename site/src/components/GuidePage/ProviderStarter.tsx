import type { VNode } from 'preact'
import type { Provider } from '@/data/primitives'
import { primitives } from '@/data/primitives'
import { ProviderPrimitiveTabs } from './ProviderPrimitiveTabs'
import type { ProviderPrimitiveExample } from './ProviderPrimitiveTabs'

export type ProviderStarterExample = ProviderPrimitiveExample

export interface ProviderStarterProps {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly primitiveId: string
  readonly examples?: Partial<Record<Provider, ProviderStarterExample>>
}

export function ProviderStarter({
  id,
  title,
  description,
  primitiveId,
  examples,
}: ProviderStarterProps): VNode {
  const primitive = primitives.find((candidate) => candidate.id === primitiveId)

  if (primitive == null) {
    return (
      <section id={id} className="scroll-mt-24 mb-16">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="mt-4 text-muted-foreground">Provider details are not available.</p>
      </section>
    )
  }

  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
        Start here
      </p>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      <ProviderPrimitiveTabs
        primitiveId={primitiveId}
        idPrefix={`${id}-provider`}
        ariaLabel={`${title} provider`}
        {...(examples == null ? {} : { examples })}
      />
    </section>
  )
}
