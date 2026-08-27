import { primitives } from './primitives'

const providerNames = {
  copilot: 'GitHub Copilot',
  claude: 'Claude Code',
  cursor: 'Cursor',
  codex: 'OpenAI Codex',
} as const

const mcpPrimitive = primitives.find((primitive) => primitive.id === 'tool-integrations')

if (mcpPrimitive == null) {
  throw new Error('Missing tool-integrations primitive')
}

export const mcpScopeProfiles = mcpPrimitive.implementations.map((implementation) => ({
  id: implementation.provider,
  label: providerNames[implementation.provider],
  tone: implementation.provider,
  sourceUrl: implementation.sourceUrl,
  scopes: implementation.scopes ?? [],
}))
