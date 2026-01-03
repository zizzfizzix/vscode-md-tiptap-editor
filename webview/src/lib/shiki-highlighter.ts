import type { HighlighterCore } from 'shiki/core'

class ShikiHighlighterSingleton {
  private highlighter: HighlighterCore | null = null
  private initPromise: Promise<HighlighterCore> | null = null
  private loadedLanguages = new Set<string>()

  async getHighlighter(): Promise<HighlighterCore> {
    if (this.highlighter) {
      return this.highlighter
    }

    if (this.initPromise) {
      return this.initPromise
    }

    // Dynamic import - use fine-grained bundle with JavaScript engine
    this.initPromise = Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
      import('shiki/themes/dark-plus.mjs')
    ]).then(async ([{ createHighlighterCore }, { createJavaScriptRegexEngine }, darkPlus]) => {
      const highlighter = await createHighlighterCore({
        themes: [darkPlus.default],
        langs: [], // Start empty, load on demand
        engine: createJavaScriptRegexEngine()
      })
      this.highlighter = highlighter
      return highlighter
    })

    return this.initPromise
  }

  // Map of common language names to their import paths
  private languageImports: Record<string, () => Promise<any>> = {
    'javascript': () => import('@shikijs/langs/javascript'),
    'typescript': () => import('@shikijs/langs/typescript'),
    'jsx': () => import('@shikijs/langs/jsx'),
    'tsx': () => import('@shikijs/langs/tsx'),
    'python': () => import('@shikijs/langs/python'),
    'java': () => import('@shikijs/langs/java'),
    'c': () => import('@shikijs/langs/c'),
    'cpp': () => import('@shikijs/langs/cpp'),
    'csharp': () => import('@shikijs/langs/csharp'),
    'go': () => import('@shikijs/langs/go'),
    'rust': () => import('@shikijs/langs/rust'),
    'ruby': () => import('@shikijs/langs/ruby'),
    'php': () => import('@shikijs/langs/php'),
    'swift': () => import('@shikijs/langs/swift'),
    'kotlin': () => import('@shikijs/langs/kotlin'),
    'html': () => import('@shikijs/langs/html'),
    'css': () => import('@shikijs/langs/css'),
    'scss': () => import('@shikijs/langs/scss'),
    'json': () => import('@shikijs/langs/json'),
    'yaml': () => import('@shikijs/langs/yaml'),
    'markdown': () => import('@shikijs/langs/markdown'),
    'bash': () => import('@shikijs/langs/bash'),
    'shell': () => import('@shikijs/langs/shellscript'),
    'sql': () => import('@shikijs/langs/sql'),
    'xml': () => import('@shikijs/langs/xml'),
    'vue': () => import('@shikijs/langs/vue'),
    'plaintext': () => Promise.resolve({ default: [] })
  }

  async ensureLanguageLoaded(language: string): Promise<void> {
    if (this.loadedLanguages.has(language)) {
      return
    }

    const highlighter = await this.getHighlighter()
    const langImport = this.languageImports[language]
    
    if (!langImport) {
      console.warn(`Unsupported language: ${language}, falling back to plaintext`)
      this.loadedLanguages.add(language)
      return
    }

    try {
      const langModule = await langImport()
      await highlighter.loadLanguage(langModule.default)
      this.loadedLanguages.add(language)
    } catch (error) {
      console.warn(`Failed to load language: ${language}`, error)
      this.loadedLanguages.add(language) // Mark as attempted to avoid retries
    }
  }

  async highlightCode(code: string, language: string): Promise<string> {
    try {
      const highlighter = await this.getHighlighter()
      await this.ensureLanguageLoaded(language)
      
      // Check if language was successfully loaded
      const loadedLanguages = highlighter.getLoadedLanguages()
      const lang = loadedLanguages.includes(language as any) ? language : 'plaintext'
      
      return highlighter.codeToHtml(code, {
        lang: lang,
        theme: 'dark-plus'
      })
    } catch (error) {
      console.error('Error highlighting code:', error)
      return `<pre><code>${code}</code></pre>`
    }
  }

  isReady(): boolean {
    return this.highlighter !== null
  }
}

export const shikiHighlighter = new ShikiHighlighterSingleton()

