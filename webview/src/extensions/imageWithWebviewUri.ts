import Image from '@tiptap/extension-image'

declare const acquireVsCodeApi: any

export const ImageWithWebviewUri = Image.extend({
  addProseMirrorPlugins() {
    // Listen for resolved image paths
    window.addEventListener('message', (event) => {
      const message = event.data
      if (message.type === 'imagePathResolved') {
        // Update all img elements with matching src
        const imgs = document.querySelectorAll(`img[src="${message.originalPath}"]`)
        imgs.forEach((img) => {
          (img as HTMLImageElement).src = message.webviewUri
        })
      }
    })

    return this.parent?.() || []
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const src = element.getAttribute('src')
          if (!src) return null

          // If it's not already a webview URI or data URI, request conversion
          if (!src.startsWith('vscode-webview-resource:') && 
              !src.startsWith('http') && 
              !src.startsWith('data:')) {
            const vscode = acquireVsCodeApi()
            vscode.postMessage({ type: 'resolveImagePath', path: src })
          }
          
          return src
        },
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.src) {
            return {}
          }

          return {
            src: attributes.src,
          }
        },
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    }
  },
})

