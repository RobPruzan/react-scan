# React Component Name SWC

A standalone SWC-based webpack plugin for automatically injecting `displayName` properties into React components. This library extracts and reimplements the react-component-name functionality from react-scan using SWC instead of babel, providing better performance and webpack 5 compatibility without unplugin dependencies.

## Features

- 🚀 **SWC-based transformation** - Fast and efficient JSX/TSX processing
- ⚡ **Webpack 5 compatible** - Native webpack plugin without unplugin
- 🎯 **Smart component detection** - Automatically detects React components
- 🛡️ **TypeScript support** - Full TypeScript support with type definitions
- 🔧 **Configurable** - Flexible include/exclude patterns and feature flags

## Installation

```bash
npm install react-component-name-swc
# or
yarn add react-component-name-swc
# or
pnpm add react-component-name-swc
```

## Usage

### Webpack Plugin

```javascript
// webpack.config.js
const { ReactComponentNamePlugin } = require('react-component-name-swc');

module.exports = {
  // ... other webpack config
  plugins: [
    new ReactComponentNamePlugin({
      // Options (all optional)
      include: /\.[jt]sx?$/, // Files to include
      exclude: /node_modules/, // Files to exclude
      flags: {
        noTryCatchDisplayNames: false, // Wrap displayName assignments in try-catch
        noStyledComponents: false, // Skip styled-components detection
        noCreateContext: false, // Skip React.createContext detection
        ignoreComponentSubstrings: [], // Ignore components containing these substrings
      },
    }),
  ],
};
```

### Direct Transform API

```javascript
import { transform } from 'react-component-name-swc';

const code = `
function MyComponent() {
  return <div>Hello World</div>;
}
`;

const result = transform(code, 'MyComponent.tsx');
console.log(result.code);
// Output includes: MyComponent.displayName = "MyComponent";
```

## What it does

This plugin automatically adds `displayName` properties to React components, which helps with:

- **Better debugging** - Components show meaningful names in React DevTools
- **Improved error messages** - Stack traces show component names instead of anonymous functions
- **Development experience** - Easier component identification during development

### Before

```jsx
function MyComponent() {
  return <div>Hello</div>;
}

const AnotherComponent = () => <span>World</span>;

class ClassComponent extends React.Component {
  render() {
    return <p>Class component</p>;
  }
}
```

### After

```jsx
function MyComponent() {
  return <div>Hello</div>;
}
try {
  MyComponent.displayName = "MyComponent";
} catch (error) {}

const AnotherComponent = () => <span>World</span>;
try {
  AnotherComponent.displayName = "AnotherComponent";
} catch (error) {}

class ClassComponent extends React.Component {
  render() {
    return <p>Class component</p>;
  }
}
try {
  ClassComponent.displayName = "ClassComponent";
} catch (error) {}
```

## Supported Component Patterns

- Function declarations
- Arrow function expressions
- Class components (extending React.Component or React.PureComponent)
- React.memo wrapped components
- React.forwardRef wrapped components
- Higher-order components (HOCs)
- Styled components (emotion/styled, styled-components)

## Options

### `include`
- **Type:** `string | RegExp | Array<string | RegExp>`
- **Default:** `/\.[cm]?[jt]sx?$/`
- **Description:** Files to include in transformation

### `exclude`
- **Type:** `string | RegExp | Array<string | RegExp>`
- **Default:** `[/node_modules/, /\/_app\.[jt]sx?$/, /\/_document\.[jt]sx?$/, /\/api\//, /\/\.million\//]`
- **Description:** Files to exclude from transformation

### `flags.noTryCatchDisplayNames`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Skip wrapping displayName assignments in try-catch blocks

### `flags.noStyledComponents`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Skip detection of styled-components

### `flags.noCreateContext`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Skip detection of React.createContext calls

### `flags.ignoreComponentSubstrings`
- **Type:** `Array<string>`
- **Default:** `[]`
- **Description:** Ignore components whose names contain these substrings

## Performance

This plugin uses SWC for parsing and transformation, which is significantly faster than babel-based alternatives. The webpack integration is optimized to process only relevant files and avoid unnecessary transformations.

## Comparison with react-scan

This library extracts the component name injection functionality from [react-scan](https://github.com/aidenybai/react-scan) and reimplements it with the following improvements:

- **No babel dependency** - Uses SWC for faster transformation
- **No unplugin dependency** - Native webpack plugin implementation
- **Webpack 5 optimized** - Built specifically for webpack 5 compatibility
- **Standalone** - Can be used independently without the full react-scan suite

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
