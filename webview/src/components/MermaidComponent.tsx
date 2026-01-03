import { useEffect, useState } from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import mermaid from 'mermaid'
import './MermaidComponent.css'

export const MermaidComponent = ({ node }: NodeViewProps) => {
  const [renderedDiagram, setRenderedDiagram] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [diagramId] = useState(`mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    // Initialize mermaid with dark theme to match VS Code
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#569cd6',
        primaryTextColor: '#d4d4d4',
        primaryBorderColor: '#264f78',
        lineColor: '#858585',
        secondaryColor: '#3c3c3c',
        tertiaryColor: '#252526',
        background: '#1e1e1e',
        mainBkg: '#1e1e1e',
        textColor: '#d4d4d4',
        fontSize: '14px',
      },
    })
    
    renderDiagram()
  }, [])

  useEffect(() => {
    renderDiagram()
  }, [node.textContent])

  const renderDiagram = async () => {
    try {
      setHasError(false)
      setErrorMessage('')
      
      const mermaidCode = node.textContent || ''
      if (!mermaidCode.trim()) {
        setRenderedDiagram('')
        return
      }

      const { svg } = await mermaid.render(diagramId, mermaidCode)
      setRenderedDiagram(svg)
    } catch (error: any) {
      setHasError(true)
      setErrorMessage(error.message || 'Invalid Mermaid syntax')
      setRenderedDiagram('')
    }
  }

  return (
    <NodeViewWrapper className="mermaid-node">
      <div className="mermaid-header">
        <span className="mermaid-label">Mermaid Diagram</span>
      </div>
      <div className="mermaid-editor">
        <NodeViewContent />
      </div>
      {renderedDiagram && !hasError && (
        <div 
          className="mermaid-render"
          dangerouslySetInnerHTML={{ __html: renderedDiagram }}
        />
      )}
      {hasError && (
        <div className="mermaid-error">
          <strong>Mermaid Error:</strong> {errorMessage}
        </div>
      )}
    </NodeViewWrapper>
  )
}

