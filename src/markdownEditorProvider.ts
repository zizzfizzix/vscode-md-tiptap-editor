import * as vscode from 'vscode';

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MarkdownEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      'tiptapMarkdown.editor',
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      }
    );
    return providerRegistration;
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup webview options
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview'),
      ],
    };

    // Set HTML content
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    // Track the last content received from webview to avoid unnecessary syncs
    // This prevents cursor jumping on save or when content hasn't actually changed
    let lastWebviewContent: string | null = null;

    // Send content to webview
    const updateWebview = (force: boolean = false) => {
      const currentContent = document.getText();
      
      // Skip if content matches what the webview last sent us (unless forced)
      if (!force && lastWebviewContent === currentContent) {
        return;
      }
      
      webviewPanel.webview.postMessage({
        type: 'init',
        content: currentContent,
        documentUri: document.uri.toString(),
        workspaceUri: vscode.workspace.workspaceFolders?.[0]?.uri.toString(),
      });
    };

    // Hook up event handlers - only sync external changes to webview
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    // Handle messages from webview
    webviewPanel.webview.onDidReceiveMessage(async e => {
      switch (e.type) {
        case 'update':
          // Store the content from webview before applying
          lastWebviewContent = e.content;
          await this.updateTextDocument(document, e.content);
          return;
        case 'resolveImagePath':
          // Convert local file path to webview URI
          const imagePath = e.path;
          let imageUri: vscode.Uri;
          
          if (imagePath.startsWith('/') || imagePath.match(/^[a-zA-Z]:/)) {
            // Absolute path
            imageUri = vscode.Uri.file(imagePath);
          } else {
            // Relative path - resolve from document directory
            const documentDir = vscode.Uri.joinPath(document.uri, '..');
            imageUri = vscode.Uri.joinPath(documentDir, imagePath);
          }
          
          const webviewUri = webviewPanel.webview.asWebviewUri(imageUri);
          webviewPanel.webview.postMessage({
            type: 'imagePathResolved',
            originalPath: imagePath,
            webviewUri: webviewUri.toString(),
          });
          return;
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Initial load - force send content to webview
    updateWebview(true);
  }

  private updateTextDocument(document: vscode.TextDocument, content: string) {
    const edit = new vscode.WorkspaceEdit();
    
    // Replace entire document
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      content
    );

    return vscode.workspace.applyEdit(edit);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview', 'assets', 'main.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview', 'assets', 'main.css')
    );

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource}; font-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:;">
        <link href="${styleUri}" rel="stylesheet">
        <title>Tiptap Markdown Editor</title>
      </head>
      <body>
        <div id="app"></div>
        <script type="module" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

