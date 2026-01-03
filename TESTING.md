# Testing Guide

This guide will help you test the Tiptap Markdown Editor extension.

## Quick Start

1. **Launch the Extension**
   - Open this project in VS Code
   - Press `F5` to launch the Extension Development Host
   - A new VS Code window will open with the extension active

2. **Open the Demo File**
   - In the Extension Development Host window, open `DEMO.md`
   - The file should automatically open in the Tiptap WYSIWYG editor

## Features to Test

### ✅ Basic Text Formatting
- [ ] Type some text
- [ ] Make text **bold** (Ctrl/Cmd + B)
- [ ] Make text *italic* (Ctrl/Cmd + I)
- [ ] Create a `code span` with backticks
- [ ] Try ~~strikethrough~~ with double tildes

### ✅ Headings
- [ ] Create headings with # symbols
- [ ] Try different levels (h1-h6)
- [ ] Verify they render with different sizes

### ✅ Lists
- [ ] Create unordered lists with `-` or `*`
- [ ] Create ordered lists with `1.`
- [ ] Try nested lists (indent with Tab)
- [ ] Create task lists with `- [ ]` and `- [x]`
- [ ] Click checkboxes to toggle them

### ✅ Tables
- [ ] Create a table with pipes `|`
- [ ] Try resizing columns (drag the edges)
- [ ] Add/remove rows and columns

### ✅ Code Blocks
- [ ] Create a code block with triple backticks
- [ ] Change the language using the dropdown
- [ ] Verify syntax highlighting works
- [ ] Try multiple languages (JavaScript, Python, Go, etc.)

### ✅ Math Rendering
- [ ] Inline math: Type `$E=mc^2$`
- [ ] Block math: Type `$$\int_0^1 x dx$$`
- [ ] Verify KaTeX renders correctly
- [ ] Click on math to edit the LaTeX

### ✅ Mermaid Diagrams
- [ ] Create a code block with language `mermaid`
- [ ] Add a simple diagram (see DEMO.md for examples)
- [ ] Verify the diagram renders
- [ ] Click to edit the mermaid code

### ✅ Links and Images
- [ ] Create a link: `[text](url)`
- [ ] Add an image: `![alt](path)`
- [ ] Test with local image paths
- [ ] Test with web URLs

### ✅ Blockquotes
- [ ] Create blockquote with `>`
- [ ] Try multi-line blockquotes

### ✅ Horizontal Rules
- [ ] Create with `---` or `***`

## Save and Persistence Testing

### ✅ Auto-save
- [ ] Make changes to a file
- [ ] Wait for the indicator to show "saved"
- [ ] Verify changes persist after closing

### ✅ Dirty State
- [ ] Make changes without saving
- [ ] Try to close the editor
- [ ] Verify you're prompted to save

### ✅ Hot-exit
- [ ] Make changes without saving
- [ ] Close VS Code entirely
- [ ] Reopen VS Code
- [ ] Verify unsaved changes are restored

## Theme Testing

### ✅ Light Theme
- [ ] Switch to a light theme
- [ ] Verify editor colors adapt
- [ ] Check code blocks, tables, etc.

### ✅ Dark Theme
- [ ] Switch to a dark theme
- [ ] Verify editor colors adapt
- [ ] Check all UI elements

## Performance Testing

### ✅ Large Files
- [ ] Open a large markdown file (>1000 lines)
- [ ] Test scrolling performance
- [ ] Test editing performance

### ✅ Complex Content
- [ ] File with many code blocks
- [ ] File with many tables
- [ ] File with math and diagrams

## Known Issues to Verify

1. **Math Editing**: You need to click on math to edit it (not inline)
2. **Mermaid Editing**: You need to click on diagrams to edit them
3. **Image Paths**: Relative paths should be resolved from the document directory

## Debugging

If something doesn't work:

1. **Open Developer Tools**
   - Help → Toggle Developer Tools
   - Check Console for errors

2. **Check Extension Host Logs**
   - View → Output → Extension Host

3. **Rebuild**
   - Run `pnpm run build` in the terminal
   - Restart the Extension Development Host

## Success Criteria

The extension is working correctly if:
- ✅ Markdown files open in WYSIWYG editor by default
- ✅ All formatting options work
- ✅ Changes save automatically
- ✅ Code blocks have syntax highlighting
- ✅ Math renders with KaTeX
- ✅ Mermaid diagrams render
- ✅ Theme matches VS Code theme
- ✅ No console errors

## Feedback

If you find issues, please check:
1. Console errors (F12)
2. Extension host output
3. Network tab (for resource loading issues)

