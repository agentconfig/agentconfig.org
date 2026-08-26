export const providerSelectionEvent = 'provider-selection'

export function readProviderSelection(queryParam = 'provider'): string | null {
  if (typeof window === 'undefined') return null

  return new URLSearchParams(window.location.search).get(queryParam)
}

export function writeProviderSelection(providerId: string, queryParam = 'provider'): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  url.searchParams.set(queryParam, providerId)
  window.history.replaceState(window.history.state, '', url)
  window.dispatchEvent(new Event(providerSelectionEvent))
}
