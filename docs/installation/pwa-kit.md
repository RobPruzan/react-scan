# Salesforce Commerce Cloud PWA Kit Guide

## As a script tag

Add the script tag to your HTML template or root layout.
Refer to the [CDN Guide](https://github.com/aidenybai/react-scan/blob/main/docs/installation/cdn.md) for the available URLs.

```html
<!doctype html>
<html lang="en">
  <head>
    <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
    <!-- rest of your scripts go under -->
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

## As a module import

Import `scan` in your client entry (e.g. `app/client`) **before** importing React.

```jsx
// app/client
import { scan } from "react-scan"; // must be imported before React and React DOM
import React from "react";

scan({
  enabled: true,
});
```

> [!CAUTION]
> React Scan must be imported before React (and other React renderers like React DOM) in your entire project, as it needs to hijack React DevTools before React gets to access it.

### Webpack plugin

To preserve component names when bundling, add the React Scan webpack plugin:

```js
// webpack.config.js
const ReactScanComponentNamePlugin = require("react-scan/react-component-name/webpack");

module.exports = {
  // ...
  plugins: [ReactScanComponentNamePlugin()],
};
```
