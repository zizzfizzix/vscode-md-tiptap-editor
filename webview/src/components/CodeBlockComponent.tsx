import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import './CodeBlockComponent.css'

// Common languages to support
const languages = [
  'plaintext', 'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
  'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'html', 'css', 'scss', 'json',
  'yaml', 'markdown', 'bash', 'shell', 'sql', 'xml', 'vue', 'jsx', 'tsx'
]

export const CodeBlockComponent = ({ node, updateAttributes }: NodeViewProps) => {
  const language = node.attrs.language || 'plaintext'

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value
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
      <pre className="code-block-content">
        <NodeViewContent />
      </pre>
    </NodeViewWrapper>
  )
}


