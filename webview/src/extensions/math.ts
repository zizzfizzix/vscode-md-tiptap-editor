import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { MathComponent } from '../components/MathComponent'

export interface MathOptions {
  HTMLAttributes: Record<string, any>
}

// Inline math node
export const MathInline = Node.create<MathOptions>({
  name: 'mathInline',

  group: 'inline',

  content: 'text*',

  inline: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-latex'),
        renderHTML: (attributes: Record<string, any>) => {
          return {
            'data-latex': attributes.latex,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math-inline"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'math-inline' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent)
  },
})

// Block math node
export const MathBlock = Node.create<MathOptions>({
  name: 'mathBlock',

  group: 'block',

  content: 'text*',

  atom: true,

  code: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-latex'),
        renderHTML: (attributes: Record<string, any>) => {
          return {
            'data-latex': attributes.latex,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="math-block"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'math-block' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent)
  },
})

