import type { VNode } from 'preact'
import { ChevronDown } from 'lucide-preact'
import { providers } from '@/data/providers'
import type { Provider } from '@/data/primitives'
import { cn } from '@/lib/utils'
import { writeProviderSelection } from '@/lib/providerSelection'

interface ProviderChooserProps {
  readonly id: string
  readonly selectedProvider: Provider | ''
  readonly mobile?: boolean
}

export function ProviderChooser({
  id,
  selectedProvider,
  mobile = false,
}: ProviderChooserProps): VNode {
  return (
    <div className={cn(mobile && 'border-t border-border px-4 pt-4')}>
      <label
        htmlFor={id}
        className={cn(
          mobile
            ? 'mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            : 'sr-only'
        )}
      >
        Provider
      </label>
      <div className="relative">
        <select
          id={id}
          aria-label="Provider"
          value={selectedProvider}
          onChange={(event) => {
            const providerId = event.currentTarget.value
            if (providerId !== '') writeProviderSelection(providerId)
          }}
          className={cn(
            'h-10 appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm font-semibold text-foreground transition-colors',
            'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            mobile ? 'w-full' : 'min-w-44'
          )}
        >
          <option value="" disabled>Choose Provider</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
