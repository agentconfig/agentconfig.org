function isStorageAccessError(error: unknown): boolean {
  return error instanceof DOMException
    && ['SecurityError', 'QuotaExceededError'].includes(error.name)
}

export function readLocalStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    if (isStorageAccessError(error)) return null
    throw error
  }
}

export function writeLocalStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch (error) {
    if (!isStorageAccessError(error)) throw error
  }
}
