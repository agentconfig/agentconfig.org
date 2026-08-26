import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'

type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

const BUNDLED_LANGS = ['bash', 'javascript', 'json', 'markdown', 'typescript', 'jsx', 'tsx', 'yaml'] as const
const LANG_ALIASES: Record<string, string> = {
  text: 'plaintext',
  plaintext: 'plaintext',
  sh: 'bash',
  shell: 'bash',
  js: 'javascript',
  ts: 'typescript',
}

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (highlighterPromise == null) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['github-light-high-contrast', 'github-dark-high-contrast'],
        langs: [...BUNDLED_LANGS],
      })
    )
  }
  return highlighterPromise
}

function resolveLang(language: string | undefined): string {
  if (language == null || language === '') {
    return 'plaintext'
  }
  const normalized = language.toLowerCase()
  return LANG_ALIASES[normalized] ?? normalized
}

/**
 * Highlights code with Shiki's dual light/dark theme output. The returned HTML
 * uses CSS variables (`--shiki-light` / `--shiki-dark`) toggled by the site's
 * `.dark` class, so no re-highlighting is needed for theme switches.
 */
export async function highlightCode(code: string, language: string | undefined): Promise<string> {
  const highlighter = await getHighlighter()
  const lang = resolveLang(language)
  const loadedLangs = highlighter.getLoadedLanguages()

  return highlighter.codeToHtml(code, {
    lang: (loadedLangs.includes(lang) ? lang : 'plaintext') as BundledLanguage,
    themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
    defaultColor: false,
  })
}
