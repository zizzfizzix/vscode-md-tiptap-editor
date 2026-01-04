import { createParser } from 'prosemirror-highlight/shiki'
import { createHighlightPlugin } from 'prosemirror-highlight'
import type { Plugin } from '@tiptap/pm/state'
import { shikiHighlighter } from './shiki-highlighter'

// Cache the plugin promise
let pluginPromise: Promise<Plugin> | null = null

// Languages to preload for syntax highlighting
const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'jsx', 'tsx', 'python', 'java', 'c', 'cpp',
  'csharp', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'html', 'css',
  'scss', 'json', 'yaml', 'markdown', 'bash', 'shell', 'sql', 'xml', 'vue'
]

/**
 * Gets or creates the Shiki highlight plugin for ProseMirror.
 * The plugin is created asynchronously but cached for reuse.
 * Preloads all supported languages to ensure they're available.
 */
export async function getShikiHighlightPlugin(): Promise<Plugin> {
  if (pluginPromise) {
    return pluginPromise
  }
  
  pluginPromise = (async () => {
    try {
      const highlighter = await shikiHighlighter.getHighlighter()
      
      // Preload all supported languages
      console.log('Preloading syntax highlighting languages...')
      await Promise.all(
        SUPPORTED_LANGUAGES.map(lang => shikiHighlighter.ensureLanguageLoaded(lang))
      )
      console.log('Syntax highlighting languages loaded successfully')
      
      const parser = createParser(highlighter)
      return createHighlightPlugin({ parser })
    } catch (error) {
      console.error('Failed to initialize Shiki highlighting:', error)
      pluginPromise = null // Reset on error so it can be retried
      throw error
    }
  })()
  
  return pluginPromise
}


