/**
 * Singleton wrapper for VS Code API.
 * acquireVsCodeApi() can only be called once per webview session,
 * so we store the instance and export it for reuse.
 */

declare const acquireVsCodeApi: any;

// Acquire the VS Code API once and cache it
const vscodeApi = acquireVsCodeApi();

export { vscodeApi };

