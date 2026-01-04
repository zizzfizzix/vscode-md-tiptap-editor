"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table"
import { Markdown, type MarkdownStorage } from "tiptap-markdown"

// --- Advanced Extensions ---
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CodeBlockComponent } from './components/CodeBlockComponent'
import { InlineMathWithMarkdown, BlockMathWithMarkdown } from './extensions/mathematicsWithMarkdown'
import 'katex/dist/katex.min.css'
import { Mermaid } from "./extensions/mermaid"
import { ImageWithWebviewUri } from "./extensions/imageWithWebviewUri"
import { MathEditDialog } from "./components/MathEditDialog"

// --- Components ---
import { EditorToolbar } from "@/components/EditorToolbar"

// --- Tiptap Node Styles ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/styles/math.css"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// VS Code API singleton
import { vscodeApi as vscode } from "@/lib/vscode-api"

// Create lowlight instance
const lowlight = createLowlight(common)

// Create custom CodeBlock extension with NodeView
const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },
}).configure({ lowlight })

export function SimpleEditor() {
  // Layout state (not editor-related, won't cause editor re-renders)
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter">("main")
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [isUpdatingFromVscode, setIsUpdatingFromVscode] = useState(false)
  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // Math dialog state
  const [mathDialog, setMathDialog] = useState<{
    isOpen: boolean
    type: 'inline' | 'block'
    latex: string
    pos: number | null  // null means creating new, number means editing existing
  }>({
    isOpen: false,
    type: 'inline',
    latex: '',
    pos: null,
  })

  // Create editor instance - isolated from layout state
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false, // Key performance optimization!
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: "simple-editor tiptap-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We use custom CodeBlockLowlight
      }),
      CustomCodeBlock,
      InlineMathWithMarkdown.configure({
        onClick: (node: any, pos: number) => {
          setMathDialog({
            isOpen: true,
            type: 'inline',
            latex: node.attrs.latex || '',
            pos,
          })
        },
        katexOptions: {
          throwOnError: false,
        },
      }),
      BlockMathWithMarkdown.configure({
        onClick: (node: any, pos: number) => {
          setMathDialog({
            isOpen: true,
            type: 'block',
            latex: node.attrs.latex || '',
            pos,
          })
        },
        katexOptions: {
          throwOnError: false,
        },
      }),
      Mermaid,
      ImageWithWebviewUri, // Custom image extension (replaces standard Image)
      Markdown, // Includes Underline by default
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
    ],
    content: '',
    onCreate: () => {
      // Send ready signal to extension
      vscode.postMessage({ type: 'ready' });
    },
    onUpdate: ({ editor }) => {
      if (isUpdatingFromVscode) {
        return
      }

      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current)
      }

      updateTimerRef.current = setTimeout(() => {
        // TipTap extensions add storage properties dynamically at runtime.
        // The tiptap-markdown extension adds 'markdown' to editor.storage.
        const storage = editor.storage as unknown as { markdown: MarkdownStorage }
        const content = storage.markdown.getMarkdown()
        vscode.postMessage({
          type: 'update',
          content: content,
        })
      }, 300)
    },
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })
  
  // Math dialog handlers
  const handleMathSave = (latex: string) => {
    if (editor && mathDialog.isOpen) {
      if (mathDialog.pos === null) {
        // Creating new math node
        if (mathDialog.type === 'inline') {
          editor.commands.insertInlineMath({ latex })
        } else {
          editor.commands.insertBlockMath({ latex })
        }
      } else {
        // Updating existing math node
        if (mathDialog.type === 'inline') {
          editor.commands.updateInlineMath({ latex, pos: mathDialog.pos })
        } else {
          editor.commands.updateBlockMath({ latex, pos: mathDialog.pos })
        }
      }
      editor.commands.focus()
      setMathDialog({ ...mathDialog, isOpen: false })
    }
  }

  const handleMathCancel = () => {
    setMathDialog({ ...mathDialog, isOpen: false })
  }
  
  // Function to open dialog for new math insertion
  const openMathDialog = (type: 'inline' | 'block') => {
    setMathDialog({
      isOpen: true,
      type,
      latex: '',
      pos: null,  // null indicates we're creating new
    })
  }

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  // Listen for messages from VS Code
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data
      
      switch (message.type) {
        case 'init':
          if (editor) {
            setIsUpdatingFromVscode(true)
            editor.commands.setContent(message.content)
            setIsUpdatingFromVscode(false)
          }
          break
      }
    }

    window.addEventListener('message', messageHandler)
    
    return () => {
      window.removeEventListener('message', messageHandler)
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current)
      }
    }
  }, [editor])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <EditorToolbar
          ref={toolbarRef}
          editor={editor}
          isMobile={isMobile}
          mobileView={mobileView}
          onMobileViewChange={setMobileView}
          onInsertMath={openMathDialog}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        />

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
        
        <MathEditDialog
          isOpen={mathDialog.isOpen}
          type={mathDialog.type}
          initialLatex={mathDialog.latex}
          onSave={handleMathSave}
          onCancel={handleMathCancel}
        />
      </EditorContext.Provider>
    </div>
  )
}

