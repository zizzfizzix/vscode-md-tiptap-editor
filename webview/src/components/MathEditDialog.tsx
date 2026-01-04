import { useEffect, useState, useRef } from 'react'
import './MathEditDialog.css'

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

interface MathEditDialogProps {
  isOpen: boolean
  type: 'inline' | 'block'
  initialLatex: string
  onSave: (latex: string) => void
  onCancel: () => void
}

export const MathEditDialog = ({
  isOpen,
  type,
  initialLatex,
  onSave,
  onCancel,
}: MathEditDialogProps) => {
  const [latex, setLatex] = useState(initialLatex)
  const [renderedMath, setRenderedMath] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      setLatex(initialLatex)
      // Focus textarea when dialog opens
      setTimeout(() => {
        textareaRef.current?.focus()
        textareaRef.current?.select()
      }, 0)
    }
  }, [isOpen, initialLatex])

  useEffect(() => {
    renderMath()
  }, [latex, type])

  const renderMath = async () => {
    try {
      setHasError(false)
      setErrorMessage('')
      
      if (!latex.trim()) {
        setRenderedMath('')
        return
      }

      const katex = await loadKatex()
      const html = katex.renderToString(latex, {
        displayMode: type === 'block',
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

  const handleSave = () => {
    if (!hasError) {
      onSave(latex)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave()
    }
  }

  if (!isOpen) return null

  return (
    <div className="math-dialog-overlay" onClick={onCancel}>
      <div className="math-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="math-dialog-header">
          <h3>Edit {type === 'inline' ? 'Inline' : 'Block'} Math</h3>
          <button 
            className="math-dialog-close" 
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="math-dialog-body">
          <div className="math-dialog-section">
            <label htmlFor="latex-input">LaTeX Code</label>
            <textarea
              ref={textareaRef}
              id="latex-input"
              className="math-dialog-textarea"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter LaTeX code..."
              rows={type === 'block' ? 6 : 3}
            />
            <div className="math-dialog-hint">
              Press Ctrl+Enter (Cmd+Enter on Mac) to save, Esc to cancel
            </div>
          </div>

          <div className="math-dialog-section">
            <label>Preview</label>
            <div className={`math-dialog-preview ${type === 'block' ? 'block' : 'inline'}`}>
              {renderedMath && !hasError && (
                <div 
                  className="math-preview-render"
                  dangerouslySetInnerHTML={{ __html: renderedMath }}
                />
              )}
              {hasError && (
                <div className="math-preview-error">
                  {errorMessage}
                </div>
              )}
              {!latex.trim() && !hasError && (
                <div className="math-preview-empty">
                  Preview will appear here...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="math-dialog-footer">
          <button 
            className="math-dialog-button math-dialog-button-cancel" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="math-dialog-button math-dialog-button-save" 
            onClick={handleSave}
            disabled={hasError || !latex.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

