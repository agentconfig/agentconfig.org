import { useEffect, useState } from 'preact/hooks'
import { providers } from '@/data/providers'
import type { Provider } from '@/data/primitives'
import {
  providerSelectionEvent,
  readProviderSelection,
} from '@/lib/providerSelection'

function readKnownProvider(): Provider | '' {
  const providerId = readProviderSelection()
  return providers.some((provider) => provider.id === providerId)
    ? providerId as Provider
    : ''
}

export function useSelectedProvider(): Provider | '' {
  const [selectedProvider, setSelectedProvider] = useState<Provider | ''>(readKnownProvider)

  useEffect(() => {
    const syncFromUrl = (): void => {
      setSelectedProvider(readKnownProvider())
    }

    window.addEventListener('popstate', syncFromUrl)
    window.addEventListener(providerSelectionEvent, syncFromUrl)
    return () => {
      window.removeEventListener('popstate', syncFromUrl)
      window.removeEventListener(providerSelectionEvent, syncFromUrl)
    }
  }, [])

  return selectedProvider
}
