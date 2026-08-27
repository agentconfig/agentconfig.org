/**
 * Page Registry
 * 
 * Central registry of all tutorial/content pages on agentconfig.org.
 * Used by the generate-llms skill to automatically include all pages
 * in llms.txt and llms-full.txt files.
 * 
 * When creating a new page, add an entry here to ensure it's included
 * in the LLMs documentation.
 */

export interface PageMeta {
  /** URL path segment (e.g., 'skills' for /skills/) */
  slug: string
  /** Display title for the page */
  title: string
  /** One-line description for llms.txt */
  description: string
  /** Homepage feature highlights (shown in llms.txt) */
  features?: string
  /** Data file in site/src/data/ that contains the page content */
  dataFile?: string
  /** Generated .md filename in site/public/ */
  mdFile?: string
  /** Part number in llms-full.txt (auto-assigned if not set) */
  partNumber?: number
}

/**
 * All content pages on the site.
 * The homepage is handled separately in the generate-llms script.
 */
export const pages: readonly PageMeta[] = [
  {
    slug: 'skills',
    title: 'Skills Tutorial',
    description: 'How to create agent skills following the agentskills.io specification',
    features: 'Skills tutorial with 5 example skills',
    dataFile: 'skillsTutorial.ts',
    mdFile: 'skills.md',
    partNumber: 4,
  },
  {
    slug: 'agents',
    title: 'Agent Instructions',
    description: 'Project instruction files and provider-specific locations for GitHub Copilot, Claude Code, Cursor, and OpenAI Codex',
    features: 'Progressive agent instruction guide with provider-aware examples',
    dataFile: 'agentsTutorial.ts',
    mdFile: 'agents.md',
    partNumber: 5,
  },
  {
    slug: 'hooks',
    title: 'Hooks Tutorial',
    description: 'Design, test, and map lifecycle hooks across provider runtimes',
    features: 'Hooks tutorial with provider tabs, reusable policy logic, and fixture tests',
    dataFile: 'hooksTutorial.ts',
    mdFile: 'hooks.md',
    partNumber: 6,
  },
  {
    slug: 'mcp',
    title: 'MCP Tool Integrations',
    description: 'Connect AI assistants to external tools via Model Context Protocol',
    features: 'MCP tutorial with configuration examples',
    dataFile: 'mcpTutorial.ts',
    mdFile: 'mcp.md',
    partNumber: 7,
  },
  {
    slug: 'profiles',
    title: 'Provider Profiles',
    description: 'Per-provider view of every primitive: support level, implementation, location, and source documentation',
    features: 'Provider profiles generated from the typed primitives model',
    dataFile: 'providerProfiles.ts',
    mdFile: 'profiles.md',
    partNumber: 8,
  },
] as const
