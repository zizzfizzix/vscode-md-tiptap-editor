import { useEffect, useState, useRef } from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import { createHighlighter, type Highlighter } from 'shiki'
import './CodeBlockComponent.css'

// Common languages to support
const languages = [
  'plaintext', 'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
  'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'html', 'css', 'scss', 'json',
  'yaml', 'markdown', 'bash', 'shell', 'sql', 'xml', 'vue', 'jsx', 'tsx'
]

export const CodeBlockComponent = ({ node, updateAttributes }: NodeViewProps) => {
  const [language, setLanguage] = useState<string>(node.attrs.language || 'plaintext')
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const highlighterRef = useRef<Highlighter | null>(null)

  // Initialize Shiki highlighter
  useEffect(() => {
    const initHighlighter = async () => {
      highlighterRef.current = await createHighlighter({
        themes: ['dark-plus'],
        langs: languages,
      })
      updateHighlight()
    }
    initHighlighter()
  }, [])

  // Update highlight when content or language changes
  useEffect(() => {
    updateHighlight()
  }, [node.textContent, language])

  const updateHighlight = () => {
    if (!highlighterRef.current) return

    try {
      const code = node.textContent || ''
      const lang = language || 'plaintext'
      
      const html = highlighterRef.current.codeToHtml(code, {
        lang: lang,
        theme: 'dark-plus'
      })
      setHighlightedCode(html)
    } catch (error) {
      console.error('Error highlighting code:', error)
      setHighlightedCode(`<pre><code>${node.textContent}</code></pre>`)
    }
  }

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value
    setLanguage(newLang)
    updateAttributes({ language: newLang })
  }

  return (
    <NodeViewWrapper className="code-block">
      <div className="code-block-header">
        <select 
          value={language} 
          onChange={onLanguageChange}
          className="language-select"
          contentEditable={false}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="code-block-content">
        <NodeViewContent />
        {highlightedCode && (
          <div 
            className="highlighted-overlay"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}

