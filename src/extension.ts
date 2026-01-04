import * as vscode from 'vscode';
import { MarkdownEditorProvider } from './markdownEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  // Register the custom editor provider
  context.subscriptions.push(
    MarkdownEditorProvider.register(context)
  );

  // Register the "Open with Tiptap" command
  context.subscriptions.push(
    vscode.commands.registerCommand('tiptapMarkdown.openWith', async (uri?: vscode.Uri) => {
      // If no URI is provided, try to get the active editor's URI
      if (!uri) {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
          uri = activeEditor.document.uri;
        } else {
          vscode.window.showErrorMessage('No file selected or active');
          return;
        }
      }

      // Check if it's a markdown file
      if (!uri.fsPath.endsWith('.md')) {
        vscode.window.showWarningMessage('This command is only available for Markdown files');
        return;
      }

      // Open the file with the Tiptap editor
      await vscode.commands.executeCommand('vscode.openWith', uri, 'tiptapMarkdown.editor');
    })
  );

  // Apply editor associations based on setting
  const applyEditorAssociations = async () => {
    const config = vscode.workspace.getConfiguration('tiptapMarkdownEditor');
    const defaultForMarkdown = config.get<boolean>('defaultForMarkdown', false);
    
    const workbenchConfig = vscode.workspace.getConfiguration('workbench');
    const editorAssociations = workbenchConfig.get<Record<string, string>>('editorAssociations') || {};
    
    if (defaultForMarkdown) {
      // Set Tiptap as default for .md files
      editorAssociations['*.md'] = 'tiptapMarkdown.editor';
    } else {
      // Remove the association (use VS Code default)
      delete editorAssociations['*.md'];
    }
    
    await workbenchConfig.update('editorAssociations', editorAssociations, vscode.ConfigurationTarget.Global);
  };

  // Apply initial associations
  applyEditorAssociations();

  // Watch for setting changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('tiptapMarkdownEditor.defaultForMarkdown')) {
        applyEditorAssociations();
      }
    })
  );
}

export function deactivate() {}

