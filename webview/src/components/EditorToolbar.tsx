import { forwardRef } from "react"
import type { Editor } from "@tiptap/core"

import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { MathButton } from "@/components/tiptap-ui/math-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"

interface MainToolbarContentProps {
  editor: Editor | null
  onHighlighterClick: () => void
  onInsertMath: (type: 'inline' | 'block') => void
  isMobile: boolean
}

// Simplified: just render toolbar normally
// The buttons themselves use EditorContext and will handle null editor
const MainToolbarContent = ({ onHighlighterClick, onInsertMath, isMobile }: Omit<MainToolbarContentProps, 'editor'>) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
        <MathButton type="inline" onInsert={onInsertMath} />
        <MathButton type="block" onInsert={onInsertMath} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <Spacer />
    </>
  )
}

interface MobileToolbarContentProps {
  onBack: () => void
}

const MobileToolbarContent = ({ onBack }: MobileToolbarContentProps) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        <HighlighterIcon className="tiptap-button-icon" />
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    <ColorHighlightPopoverContent />
  </>
)

interface EditorToolbarProps {
  editor: Editor | null  // Keep for EditorContext, even if not used directly
  isMobile: boolean
  mobileView: "main" | "highlighter"
  onMobileViewChange: (view: "main" | "highlighter") => void
  onInsertMath: (type: 'inline' | 'block') => void
  style?: React.CSSProperties
}

export const EditorToolbar = forwardRef<HTMLDivElement, EditorToolbarProps>(({ 
  isMobile, 
  mobileView, 
  onMobileViewChange,
  onInsertMath,
  style 
}, ref) => {
  return (
    <Toolbar ref={ref} style={style}>
      {mobileView === "main" ? (
        <MainToolbarContent
          onHighlighterClick={() => onMobileViewChange("highlighter")}
          onInsertMath={onInsertMath}
          isMobile={isMobile}
        />
      ) : (
        <MobileToolbarContent onBack={() => onMobileViewChange("main")} />
      )}
    </Toolbar>
  )
})

EditorToolbar.displayName = 'EditorToolbar'

