import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { MermaidComponent } from '../components/MermaidComponent'

export interface MermaidOptions {
  HTMLAttributes: Record<string, any>
}

export const Mermaid = Node.create<MermaidOptions>({
  name: 'mermaid',

  group: 'block',

  content: 'text*',

  atom: true,

  code: true,

  // Higher priority = checked first in parseHTML
  // Must be > 100 (CodeBlockShiki's default) to match mermaid blocks first
  priority: 150,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      content: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-content'),
        renderHTML: (attributes: Record<string, any>) => {
          return {
            'data-content': attributes.content,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="mermaid"]',
      },
      // Handle markdown-it parsed mermaid code blocks
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (node) => {
          if (typeof node === 'string') return false
          const code = node.querySelector('code')
          if (!code) return false
          // Check for language-mermaid class
          return code.classList.contains('language-mermaid') ? {} : false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'mermaid' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidComponent)
  },

  // Add markdown serialization support for tiptap-markdown
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          state.write("```mermaid\n")
          state.text(node.textContent, false)
          state.ensureNewLine()
          state.write("```")
          state.closeBlock(node)
        },
        parse: {
          // Parsing is handled by parseHTML rules above
        },
      },
    }
  },
})
