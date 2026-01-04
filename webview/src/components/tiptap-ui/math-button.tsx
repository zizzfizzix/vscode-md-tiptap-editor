import { type Editor } from "@tiptap/react"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { MathIcon } from "@/components/tiptap-icons/math-icon"
import { Button } from "@/components/tiptap-ui-primitive/button"

interface MathButtonProps {
  editor?: Editor
  type: 'inline' | 'block'
  onInsert: (type: 'inline' | 'block') => void
}

export function MathButton({ editor: providedEditor, type, onInsert }: MathButtonProps) {
  const { editor } = useTiptapEditor(providedEditor)

  if (!editor) {
    return null
  }

  const handleClick = () => {
    onInsert(type)
  }

  const isDisabled = !editor.can().chain().focus().run()

  return (
    <Button
      type="button"
      data-style="ghost"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={type === 'inline' ? 'Insert inline math' : 'Insert block math'}
      tooltip={type === 'inline' ? 'Inline Math' : 'Block Math'}
    >
      <MathIcon className="tiptap-button-icon" />
      {type === 'block' && <span style={{ fontSize: '0.7em', marginLeft: '-2px' }}>₿</span>}
    </Button>
  )
}

