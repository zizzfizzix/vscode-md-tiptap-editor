import { useEffect, useState } from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import './MathComponent.css'

// Dynamic imports for heavy dependencies
let katexLoaded = false
let katexModule: any = null

const loadKatex = async () => {
  if (katexLoaded && katexModule) {
    return katexModule
  }
  
  const [katex, _] = await Promise.all([
    import('katex'),
    import('katex/dist/katex.min.css')
  ])
  
  katexModule = katex.default
  katexLoaded = true
  return katexModule
}

export const MathComponent = ({ node }: NodeViewProps) => {
  const [renderedMath, setRenderedMath] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const isBlock = node.type.name === 'mathBlock'

  useEffect(() => {
    renderMath()
  }, [node.textContent])

  const renderMath = async () => {
    try {
      setHasError(false)
      setErrorMessage('')
      
      const latex = node.textContent || ''
      if (!latex.trim()) {
        setRenderedMath('')
        return
      }

      const katex = await loadKatex()
      const html = katex.renderToString(latex, {
        displayMode: isBlock,
        throwOnError: true,
        output: 'html',
      })
      setRenderedMath(html)
    } catch (error: any) {
      setHasError(true)
      setErrorMessage(error.message || 'Invalid LaTeX')
      setRenderedMath('')
    }
  }

  return (
    <NodeViewWrapper className={`math-node ${isBlock ? 'math-block' : 'math-inline'}`}>
      <div className="math-editor">
        <NodeViewContent className="math-content" />
      </div>
      {renderedMath && !hasError && (
        <div 
          className="math-render"
          dangerouslySetInnerHTML={{ __html: renderedMath }}
        />
      )}
      {hasError && (
        <div className="math-error">
          {errorMessage}
        </div>
      )}
    </NodeViewWrapper>
  )
}

