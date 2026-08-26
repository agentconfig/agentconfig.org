import { readFileSync } from 'fs'
import { FailClosedError } from './registry.ts'
import { validateClaims, validateEvidence, validateManifest, type Claim, type FetchManifest } from './schema.ts'

function readJson(path: string, label: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new FailClosedError(`Could not read ${label} from ${path}`, [String(error)])
  }
}

export function readManifest(path: string): FetchManifest {
  const result = validateManifest(readJson(path, 'fetch manifest'))
  if (!result.ok) throw new FailClosedError('Fetch manifest failed schema validation', result.errors)
  return result.value
}

export function readBaselineClaims(path: string): Claim[] {
  const result = validateClaims(readJson(path, 'baseline claims'))
  if (!result.ok) throw new FailClosedError('Baseline claims failed schema validation', result.errors)
  return result.value
}

export function assertEvidence(claims: Claim[], manifestPath: string, baselinePath: string): void {
  const result = validateEvidence(claims, readManifest(manifestPath), readBaselineClaims(baselinePath))
  if (!result.ok) throw new FailClosedError('Claims are not bound to complete evidence; refusing to continue', result.errors)
}
