import { readLocalStorage, writeLocalStorage } from './storage'

export const providerSelectionEvent = 'provider-selection'
const providerSelectionStorageKey = 'agentconfig-provider'

export function readProviderSelection(queryParam = 'provider'): string | null {
  if (typeof window === 'undefined') return null

  const querySelection = new URLSearchParams(window.location.search).get(queryParam)
  if (querySelection != null) return querySelection

  return readLocalStorage(providerSelectionStorageKey)
}

export function writeProviderSelection(providerId: string, queryParam = 'provider'): void {
  if (typeof window === 'undefined') return

  writeLocalStorage(providerSelectionStorageKey, providerId)
  const url = new URL(window.location.href)
  url.searchParams.set(queryParam, providerId)
  window.history.replaceState(window.history.state, '', url)
  window.dispatchEvent(new Event(providerSelectionEvent))
}

export function providerAwareHref(href: string, providerId: string): string {
  if (providerId === '' || typeof window === 'undefined') return href

  const url = new URL(href, window.location.origin)
  url.searchParams.set('provider', providerId)
  return `${url.pathname}${url.search}${url.hash}`
}
