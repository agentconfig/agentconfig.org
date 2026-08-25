import { mkdirSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { FailClosedError, type LoadedRegistry } from './registry.ts'
import type { RegistrySource } from './schema.ts'

/**
 * Network retrieval. Nothing here runs during an ordinary site build; every
 * entry point requires an explicit opt-in from the caller.
 */

export const defaultSnapshotDir = join(tmpdir(), 'agentconfig-provider-docs')

export interface FetchOptions {
  allowNetwork: boolean
  outDir?: string
  timeoutMs?: number
  providers?: string[]
}

export interface SourceFetchResult {
  sourceId: string
  provider: string
  url: string
  requestedUrl: string
  status: number
  ok: boolean
  bytes: number
  retrievedAt: string
  snapshotPath: string | null
  error?: string
}

function assertNetworkAllowed(allowNetwork: boolean): void {
  if (!allowNetwork) {
    throw new FailClosedError('Network retrieval requires an explicit --allow-network flag', [
      'Documentation refresh is a deliberate operation and must never run implicitly during a build.',
    ])
  }
}

/** Providers can expose a markdown variant that is far more reliable than scraping HTML. */
export function markdownUrlFor(source: RegistrySource, retrieval: Record<string, string> | undefined): string {
  const template = retrieval?.markdown
  if (!template) return source.url
  if (template.includes('{pathname}')) {
    const pathname = new URL(source.url).pathname
    return template.replace('{pathname}', encodeURIComponent(pathname))
  }
  if (template.includes('{url}')) return template.replace('{url}', source.url)
  return source.url
}

function snapshotName(sourceId: string): string {
  return `${sourceId.replace(/[^a-zA-Z0-9._-]/g, '_')}.md`
}

export async function fetchSources(loaded: LoadedRegistry, options: FetchOptions): Promise<SourceFetchResult[]> {
  assertNetworkAllowed(options.allowNetwork)

  const outDir = options.outDir ?? defaultSnapshotDir
  const timeoutMs = options.timeoutMs ?? 30_000
  mkdirSync(outDir, { recursive: true })

  const results: SourceFetchResult[] = []

  for (const provider of loaded.registry.providers) {
    if (options.providers && options.providers.length > 0 && !options.providers.includes(provider.id)) continue

    for (const source of provider.sources) {
      const requestedUrl = markdownUrlFor(source, provider.retrieval)
      const retrievedAt = new Date().toISOString()
      try {
        const response = await fetch(requestedUrl, {
          redirect: 'follow',
          signal: AbortSignal.timeout(timeoutMs),
          headers: { 'user-agent': 'agentconfig.org provider documentation refresh' },
        })
        const body = response.ok ? await response.text() : ''
        let snapshotPath: string | null = null
        if (response.ok && body.trim() !== '') {
          snapshotPath = join(outDir, snapshotName(source.id))
          const header = [
            `<!-- source-id: ${source.id} -->`,
            `<!-- provider: ${provider.id} -->`,
            `<!-- canonical-url: ${source.url} -->`,
            `<!-- requested-url: ${requestedUrl} -->`,
            `<!-- authority: ${source.authority} -->`,
            `<!-- retrieved-at: ${retrievedAt} -->`,
            '',
          ].join('\n')
          writeFileSync(snapshotPath, header + body, 'utf8')
        }
        results.push({
          sourceId: source.id,
          provider: provider.id,
          url: source.url,
          requestedUrl,
          status: response.status,
          ok: response.ok && body.trim() !== '',
          bytes: body.length,
          retrievedAt,
          snapshotPath,
        })
      } catch (error) {
        results.push({
          sourceId: source.id,
          provider: provider.id,
          url: source.url,
          requestedUrl,
          status: 0,
          ok: false,
          bytes: 0,
          retrievedAt,
          snapshotPath: null,
          error: String(error),
        })
      }
    }
  }

  const manifestPath = join(outDir, 'manifest.json')
  writeFileSync(manifestPath, `${JSON.stringify({ retrievedAt: new Date().toISOString(), results }, null, 2)}\n`, 'utf8')

  return results
}
