import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { fetchSources, markdownUrlFor } from '../scripts/lib/fetch.ts'
import { allSources, loadRegistry } from '../scripts/lib/registry.ts'

const skillRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const loaded = loadRegistry()

/** Providers the modernization plan requires this skill to cover. */
const REQUIRED_PROVIDERS = ['copilot', 'claude', 'codex', 'cursor', 'gemini', 'windsurf', 'cline', 'devin']

describe('the shipped source registry', () => {
  test('loads and validates', () => {
    expect(loaded.registry.providers.length).toBeGreaterThan(0)
  })

  test('covers every provider the plan requires', () => {
    const ids = loaded.registry.providers.map((provider) => provider.id)
    for (const required of REQUIRED_PROVIDERS) expect(ids).toContain(required)
  })

  test('cites only https sources', () => {
    for (const source of allSources(loaded.registry)) expect(source.url.startsWith('https://')).toBe(true)
  })

  test('gives every tracked provider a primary source for instructions or hooks', () => {
    for (const provider of loaded.registry.providers) {
      if (provider.coverage !== 'tracked') continue
      const primaryTopics = provider.sources.filter((source) => source.authority === 'primary').map((source) => source.topic)
      expect(primaryTopics.length).toBeGreaterThan(0)
    }
  })

  test('keeps source ids unique across providers', () => {
    const ids = allSources(loaded.registry).map((source) => source.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('sets a freshness limit', () => {
    expect(loaded.registry.maxSourceAgeDays).toBeGreaterThan(0)
  })
})

describe('retrieval', () => {
  test('refuses to touch the network without an explicit opt-in', async () => {
    await expect(fetchSources(loaded, { allowNetwork: false })).rejects.toThrow('--allow-network')
  })

  test('prefers a markdown variant when the provider publishes one', () => {
    const source = { id: 'x.y', topic: 'hooks' as const, url: 'https://example.com/docs/hooks', authority: 'primary' as const }
    expect(markdownUrlFor(source, { markdown: '{url}.md' })).toBe('https://example.com/docs/hooks.md')
    expect(markdownUrlFor(source, { markdown: 'https://example.com/api/body?pathname={pathname}' })).toContain('%2Fdocs%2Fhooks')
    expect(markdownUrlFor(source, undefined)).toBe('https://example.com/docs/hooks')
  })
})

describe('activation', () => {
  const triggers = JSON.parse(readFileSync(join(skillRoot, 'evals/trigger-queries.json'), 'utf8')) as {
    shouldTrigger: string[]
    shouldNotTrigger: string[]
  }

  test('lists both positive and negative activation cases', () => {
    expect(triggers.shouldTrigger.length).toBeGreaterThanOrEqual(5)
    expect(triggers.shouldNotTrigger.length).toBeGreaterThanOrEqual(5)
  })

  test('keeps the two sets disjoint', () => {
    const negatives = new Set(triggers.shouldNotTrigger)
    for (const query of triggers.shouldTrigger) expect(negatives.has(query)).toBe(false)
  })

  test('describes the skill with the words that should route to it', () => {
    const skill = readFileSync(join(skillRoot, 'SKILL.md'), 'utf8')
    const description = skill.split('---')[1] ?? ''
    for (const keyword of ['provider', 'documentation', 'verify']) {
      expect(description.toLowerCase()).toContain(keyword)
    }
  })

  test('does not claim to own work that belongs to other skills', () => {
    const skill = readFileSync(join(skillRoot, 'SKILL.md'), 'utf8')
    expect(skill).toContain('add-provider')
    expect(skill).toContain('generate-llms')
  })
})
