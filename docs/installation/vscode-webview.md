# VSCode Webview Guide

React Scan can be used inside a VSCode extension's webview to debug React components rendered in that webview.

## Setup

1. Install the package in your extension workspace:

   ```bash
   npm i react-scan
   ```

2. Build or copy `react-scan/dist/auto.global.js` into your extension's webview assets. The global build exposes `window.reactScan` so you can invoke the scanner directly.

3. When constructing the webview HTML, load the script with a nonce and update the Content Security Policy to allow it. A minimal example:

   ```ts
   const nonce = getNonce();
   const scriptUri = webview.asWebviewUri(
     vscode.Uri.joinPath(extensionUri, 'media', 'react-scan', 'auto.global.js')
   );

   webview.html = `<!doctype html>
   <html lang="en">
     <head>
       <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; connect-src 'self' blob:;">
       <script nonce="${nonce}" src="${scriptUri}"></script>
     </head>
     <body>
       <div id="root"></div>
       <script nonce="${nonce}">
         window.reactScan();
       </script>
     </body>
   </html>`;
   ```

   Ensure `connect-src` allows `blob:` so the worker used by React Scan can start.

4. Start your React app inside the webview as usual. React Scan will highlight renders just like in a regular browser environment.

> [!NOTE]
> Depending on your extension's bundler you may prefer to import `scan` from `react-scan` and call it before mounting React. The global build shown above is the most straightforward way to use React Scan in a webview.
