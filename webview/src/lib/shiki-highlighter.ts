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
    'javascript': () => import('shiki/langs/javascript.mjs'),
    'typescript': () => import('shiki/langs/typescript.mjs'),
    'jsx': () => import('shiki/langs/jsx.mjs'),
    'tsx': () => import('shiki/langs/tsx.mjs'),
    'python': () => import('shiki/langs/python.mjs'),
    'java': () => import('shiki/langs/java.mjs'),
    'c': () => import('shiki/langs/c.mjs'),
    'cpp': () => import('shiki/langs/cpp.mjs'),
    'csharp': () => import('shiki/langs/csharp.mjs'),
    'go': () => import('shiki/langs/go.mjs'),
    'rust': () => import('shiki/langs/rust.mjs'),
    'ruby': () => import('shiki/langs/ruby.mjs'),
    'php': () => import('shiki/langs/php.mjs'),
    'swift': () => import('shiki/langs/swift.mjs'),
    'kotlin': () => import('shiki/langs/kotlin.mjs'),
    'html': () => import('shiki/langs/html.mjs'),
    'css': () => import('shiki/langs/css.mjs'),
    'scss': () => import('shiki/langs/scss.mjs'),
    'json': () => import('shiki/langs/json.mjs'),
    'yaml': () => import('shiki/langs/yaml.mjs'),
    'markdown': () => import('shiki/langs/markdown.mjs'),
    'bash': () => import('shiki/langs/bash.mjs'),
    'shell': () => import('shiki/langs/shellscript.mjs'),
    'sql': () => import('shiki/langs/sql.mjs'),
    'xml': () => import('shiki/langs/xml.mjs'),
    'vue': () => import('shiki/langs/vue.mjs'),
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

