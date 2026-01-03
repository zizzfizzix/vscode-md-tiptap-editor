# Tiptap Markdown Editor

A powerful WYSIWYG Markdown editor for VS Code powered by Tiptap and Vue 3.

## Features

✨ **Full WYSIWYG editing** - Edit Markdown files visually while maintaining the underlying Markdown format

🎨 **Native VS Code theming** - Seamlessly integrates with your VS Code theme (dark/light modes)

📝 **GitHub Flavored Markdown** - Complete support for:
- Headings, paragraphs, lists (ordered/unordered)
- **Bold**, *italic*, ~~strikethrough~~ formatting
- Links and images (with local path support)
- Tables with resizing
- Task lists with checkboxes
- Blockquotes and horizontal rules
- Inline `code` and code blocks

🎯 **Advanced Features**:
- **Syntax highlighting** - Code blocks with Shiki (same highlighter VS Code uses)
- **Math rendering** - Inline and block math with KaTeX ($E=mc^2$)
- **Mermaid diagrams** - Interactive diagram rendering
- **Typography** - Smart quotes, dashes, and ellipses

## Installation

### From Source

1. Clone this repository
2. Run `pnpm install` in the root directory
3. Run `pnpm run build`
4. Press `F5` to open a new VS Code window with the extension loaded

## Usage

1. Open any `.md` file in VS Code
2. The file will automatically open in the Tiptap WYSIWYG editor
3. Edit the content visually - all changes are saved back to Markdown format
4. To use the standard text editor, right-click the file and select "Open With..." → "Text Editor"

## Development

```bash
# Install dependencies
pnpm install

# Build the extension and webview
pnpm run build

# Watch mode for development
pnpm run dev

# Build extension only
pnpm run build:extension

# Build webview only
pnpm run build:webview
```

### Project Structure

```
vscode-md-tiptap-editor/
├── src/                          # Extension source code
│   ├── extension.ts              # Entry point
│   └── markdownEditorProvider.ts # Custom editor provider
├── webview/                      # Vue 3 + Tiptap webview
│   └── src/
│       ├── components/           # Vue components
│       │   ├── Editor.vue        # Main Tiptap editor
│       │   ├── CodeBlockComponent.vue
│       │   ├── MathComponent.vue
│       │   └── MermaidComponent.vue
│       ├── extensions/           # Custom Tiptap extensions
│       │   ├── codeBlockShiki.ts
│       │   ├── math.ts
│       │   ├── mermaid.ts
│       │   └── imageWithWebviewUri.ts
│       └── styles/               # CSS styling
│           └── _variables.scss
├── dist/                         # Build output
├── package.json                  # Extension manifest
└── README.md
```

## Architecture

This extension uses the VS Code `CustomTextEditorProvider` API to create a custom editor for Markdown files. The editor is implemented as a webview containing a Vue 3 application with Tiptap.

### Data Flow

1. **Opening a file**: VS Code reads the `.md` file and sends the content to the webview
2. **Editing**: User edits in the WYSIWYG Tiptap editor
3. **Saving**: Changes are serialized back to Markdown and written to the file
4. **Hot-exit**: VS Code automatically handles dirty states and unsaved changes

### Key Technical Decisions

- **Tiptap** - Headless editor framework based on ProseMirror
- **Vue 3** - Reactive UI framework for custom node views
- **Shiki** - Syntax highlighting (same engine VS Code uses)
- **KaTeX** - Fast math rendering
- **Mermaid** - Diagram generation
- **Vite** - Build tool for both extension and webview

## Keyboard Shortcuts

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + Alt + C` - Toggle code block
- Standard VS Code shortcuts (save, undo, redo, etc.)

## Known Limitations

- Math and Mermaid nodes require clicking to edit
- Very large files (>10,000 lines) may have performance issues
- Some complex Markdown features may not round-trip perfectly

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Credits

Built with:
- [Tiptap](https://tiptap.dev) - The headless editor framework
- [Vue 3](https://vuejs.org) - The progressive JavaScript framework
- [Shiki](https://shiki.matsu.io) - A beautiful syntax highlighter
- [KaTeX](https://katex.org) - The fastest math typesetting library
- [Mermaid](https://mermaid.js.org) - Generation of diagrams from text

