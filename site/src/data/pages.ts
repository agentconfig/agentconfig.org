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
    partNumber: 3,
  },
  {
    slug: 'agents',
    title: 'Agents Tutorial',
    description: 'Agent definition files (AGENTS.md, CLAUDE.md, copilot-instructions.md)',
    features: 'Agents tutorial with code samples',
    dataFile: 'agentsTutorial.ts',
    mdFile: 'agents.md',
    partNumber: 4,
  },
  {
    slug: 'mcp',
    title: 'MCP Tool Integrations',
    description: 'Connect AI assistants to external tools via Model Context Protocol',
    features: 'MCP tutorial with configuration examples',
    dataFile: 'mcpTutorial.ts',
    mdFile: 'mcp.md',
    partNumber: 5,
  },
] as const
