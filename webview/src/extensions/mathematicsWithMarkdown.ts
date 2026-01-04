import { InlineMath, BlockMath } from '@tiptap/extension-mathematics'
import markdownItKatex from '@vscode/markdown-it-katex'

// Extend InlineMath to add markdown serialization and parsing
export const InlineMathWithMarkdown = InlineMath.extend({
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          state.write(`$${node.attrs.latex}$`)
        },
        parse: {
          // Setup markdown-it-katex plugin for parsing $...$ syntax
          setup(markdownit: any) {
            markdownit.use(markdownItKatex)
          },
        },
      },
    }
  },

  parseHTML() {
    return [
      // Default parsing from the official extension
      ...this.parent?.() || [],
      // Parse markdown-it-katex generated HTML
      {
        tag: 'span.katex',
        getAttrs: (node: HTMLElement | string) => {
          if (typeof node === 'string') return false
          // Extract LaTeX from the annotation tag
          const annotation = node.querySelector('annotation[encoding="application/x-tex"]')
          if (annotation?.textContent) {
            return { latex: annotation.textContent }
          }
          return false
        },
      },
      // Also support eq tag if used
      {
        tag: 'eq',
        getAttrs: (node: HTMLElement | string) => {
          if (typeof node === 'string') return false
          const latex = node.textContent || node.getAttribute('data-latex')
          return latex ? { latex } : false
        },
      },
    ]
  },
})

// Extend BlockMath to add markdown serialization and parsing
export const BlockMathWithMarkdown = BlockMath.extend({
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          state.write(`$$\n${node.attrs.latex}\n$$`)
          state.closeBlock(node)
        },
        parse: {
          // markdown-it-katex is already set up in InlineMath
        },
      },
    }
  },

  parseHTML() {
    return [
      // Default parsing from the official extension
      ...this.parent?.() || [],
      // Parse markdown-it-katex generated HTML for block math
      {
        tag: 'div.katex-display',
        getAttrs: (node: HTMLElement | string) => {
          if (typeof node === 'string') return false
          // Extract LaTeX from the annotation tag inside katex-display
          const annotation = node.querySelector('annotation[encoding="application/x-tex"]')
          if (annotation?.textContent) {
            return { latex: annotation.textContent }
          }
          return false
        },
      },
      // Also support section tag if used
      {
        tag: 'section',
        getAttrs: (node: HTMLElement | string) => {
          if (typeof node === 'string') return false
          const latex = node.textContent || node.getAttribute('data-latex')
          return latex ? { latex } : false
        },
      },
    ]
  },
})

