import type { VNode } from 'preact'
import { ExternalLink } from 'lucide-preact'
import { CodeBlock } from '@/components/CodeBlock'
import { ProviderTabs } from '@/components/ProviderTabs'
import type { ProviderTab } from '@/components/ProviderTabs'
import { primitives, type Provider } from '@/data/primitives'
import { providers } from '@/data/providers'
import { providerAwareHref } from '@/lib/providerSelection'

export interface ProviderPrimitiveExample {
  readonly code: string
  readonly language: string
  readonly filename?: string
}

export interface ProviderPrimitiveTabsProps {
  readonly primitiveId: string
  readonly idPrefix: string
  readonly ariaLabel: string
  readonly examples?: Partial<Record<Provider, ProviderPrimitiveExample>>
}

const providerTabs: readonly ProviderTab[] = providers.map((provider) => ({
  id: provider.id,
  label: provider.name,
  tone: provider.id,
}))

export function ProviderPrimitiveTabs({
  primitiveId,
  idPrefix,
  ariaLabel,
  examples,
}: ProviderPrimitiveTabsProps): VNode {
  const primitive = primitives.find((candidate) => candidate.id === primitiveId)

  if (primitive == null) {
    return <p className="text-sm text-muted-foreground">Provider details are not available.</p>
  }

  return (
    <ProviderTabs
      tabs={providerTabs}
      idPrefix={idPrefix}
      ariaLabel={ariaLabel}
      queryParam="provider"
      renderPanel={(tab) => {
        const provider = tab.id as Provider
        const implementation = primitive.implementations.find((candidate) => candidate.provider === provider)
        const example = examples?.[provider]

        if (implementation == null) {
          return (
            <p className="text-sm text-muted-foreground">
              This provider does not have a documented implementation for {primitive.name}.
            </p>
          )
        }

        return (
          <div className="space-y-5">
            <div>
              <p className="font-semibold text-foreground">{implementation.implementation}</p>
              <p className="mt-2 text-sm text-muted-foreground">Put it here:</p>
              <code className="mt-2 inline-block max-w-full break-words rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                {implementation.location}
              </code>
              {implementation.sourceUrl != null && (
                <a
                  href={implementation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read the provider documentation
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
              <a
                href={providerAwareHref('/profiles/', provider)}
                className="mt-3 block w-fit text-sm font-medium text-primary hover:underline"
              >
                View the full {tab.label} profile
              </a>
            </div>
            {example != null && (
              <CodeBlock
                code={example.code}
                language={example.language}
                filename={example.filename}
              />
            )}
          </div>
        )
      }}
    />
  )
}
