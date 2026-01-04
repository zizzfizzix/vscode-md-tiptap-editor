import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CodeBlockComponent } from '../components/CodeBlockComponent'

export interface CodeBlockShikiOptions {
  HTMLAttributes: Record<string, any>
}

export const CodeBlockShiki = Node.create<CodeBlockShikiOptions>({
  name: 'codeBlock',

  group: 'block',

  content: 'text*',

  marks: '',

  code: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          // Extract language from code element's class (markdown-it format: class="language-xxx")
          const code = element.querySelector('code')
          if (code) {
            const langClass = Array.from(code.classList).find(c => c.startsWith('language-'))
            if (langClass) {
              return langClass.replace('language-', '')
            }
          }
          return null
        },
        renderHTML: () => {
          // Don't render language as an attribute - it's handled in main renderHTML as a class
          return {}
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }: { node: any; HTMLAttributes: Record<string, any> }) {
    const language = node.attrs.language
    const codeAttrs = language ? { class: `language-${language}` } : {}
    return ['pre', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['code', codeAttrs, 0]]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
      Backspace: () => {
        const { empty, $anchor } = this.editor.state.selection
        const isAtStart = $anchor.pos === 1

        if (!empty || $anchor.parent.type.name !== this.name) {
          return false
        }

        if (isAtStart || !$anchor.parent.textContent.length) {
          return this.editor.commands.clearNodes()
        }

        return false
      },
      'Shift-Enter': () => {
        const { $anchor } = this.editor.state.selection
        
        if ($anchor.parent.type.name !== this.name) {
          return false
        }

        return this.editor.commands.insertContent('\n')
      },
    }
  },
})


