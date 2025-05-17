# Using React Scan with Child Windows

React Scan only monitors the window where it is loaded. When rendering components into a new `window.open()` portal, install React Scan inside that child window as well.

```ts
const win = window.open('/child', 'child');
win.addEventListener('load', () => {
  const script = win.document.createElement('script');
  script.type = 'module';
  script.src = '/path/to/react-scan.js';
  script.onload = () => {
    // reactScan is exposed as a global
    (win as any).reactScan({ enabled: true });
  };
  win.document.head.appendChild(script);
});
```

This injects the React Scan script and activates scanning for the new window. Each child window must mount its own instance for outlines and toolbar to appear.
