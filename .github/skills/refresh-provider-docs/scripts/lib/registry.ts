import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { validateRegistry, type Registry, type RegistrySource } from './schema.ts'

const here = dirname(fileURLToPath(import.meta.url))

/** Repository root, resolved from .github/skills/refresh-provider-docs/scripts/lib. */
export const projectRoot = join(here, '../../../../..')
export const defaultRegistryPath = join(here, '../../data/sources.json')

export interface LoadedRegistry {
  registry: Registry
  sourceById: Map<string, RegistrySource & { provider: string; coverage: string }>
}

export class FailClosedError extends Error {
  readonly details: string[]

  constructor(message: string, details: string[] = []) {
    super(message)
    this.name = 'FailClosedError'
    this.details = details
  }
}

export function loadRegistry(path: string = defaultRegistryPath): LoadedRegistry {
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new FailClosedError(`Could not read the source registry at ${path}`, [String(error)])
  }

  const result = validateRegistry(raw)
  if (!result.ok) {
    throw new FailClosedError('The source registry is invalid; refusing to compare against unverifiable sources', result.errors)
  }

  const sourceById = new Map<string, RegistrySource & { provider: string; coverage: string }>()
  for (const provider of result.value.providers) {
    for (const source of provider.sources) {
      sourceById.set(source.id, { ...source, provider: provider.id, coverage: provider.coverage })
    }
  }

  return { registry: result.value, sourceById }
}

export function allSources(registry: Registry): Array<RegistrySource & { provider: string }> {
  return registry.providers.flatMap((provider) => provider.sources.map((source) => ({ ...source, provider: provider.id })))
}
