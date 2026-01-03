# Changelog

All notable changes to the "Tiptap Markdown Editor" extension will be documented in this file.

## [0.0.1] - 2025-01-02

### Added
- Initial release
- WYSIWYG Markdown editing with Tiptap
- GitHub Flavored Markdown support (tables, task lists, strikethrough)
- Syntax highlighting for code blocks using Shiki
- Math rendering (inline and block) with KaTeX
- Mermaid diagram support with live preview
- Native VS Code theming integration
- Image support with local path resolution
- CustomTextEditorProvider for seamless file editing
- Auto-save and dirty state management
- Debounced updates (300ms) for better performance

### Features
- 20+ programming languages supported in code blocks
- Inline math: `$E=mc^2$`
- Block math: `$$\int...$$`
- Mermaid diagrams in code blocks
- Task lists with interactive checkboxes
- Resizable tables
- Typography enhancements (smart quotes, dashes)
- Native VS Code keyboard shortcuts
- Dark and light theme support

### Technical Stack
- VS Code Extension API (CustomTextEditorProvider)
- Tiptap 3.14.0 (ProseMirror-based editor)
- Vue 3.5 (Composition API)
- Vite (Build tool)
- Shiki (Syntax highlighting)
- KaTeX (Math rendering)
- Mermaid (Diagram rendering)

