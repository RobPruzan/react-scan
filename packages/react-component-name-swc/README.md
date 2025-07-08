# @react-scan/react-component-name-swc

SWC-based webpack plugin for injecting React component display names. This package provides a high-performance alternative to babel-based component name injection using SWC transforms.

## Installation

```bash
# npm
npm install -D @react-scan/react-component-name-swc

# pnpm
pnpm add -D @react-scan/react-component-name-swc

# yarn
yarn add -D @react-scan/react-component-name-swc
```

## Usage

### Webpack Plugin

```js
const ReactComponentNamePlugin = require('@react-scan/react-component-name-swc/webpack');

module.exports = {
  plugins: [
    new ReactComponentNamePlugin({
      include: [/\.jsx?$/, /\.tsx?$/],
      exclude: [/node_modules/],
      flags: {
        noTryCatchDisplayNames: false,
        ignoreComponentSubstrings: ['HOC', 'withAuth'],
      },
    }),
  ],
};
```

### Webpack Loader

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          'swc-loader',
          {
            loader: '@react-scan/react-component-name-swc/loader',
            options: {
              include: [/\.jsx?$/, /\.tsx?$/],
              exclude: [/node_modules/],
            },
          },
        ],
      },
    ],
  },
};
```

### Transform Function

```js
const { transform } = require('@react-scan/react-component-name-swc');

const result = transform(code, filename, {
  flags: {
    noTryCatchDisplayNames: false,
  },
});

if (result) {
  console.log(result.code);
}
```

## Options

- `include`: File patterns to include (default: `/\.[cm]?[jt]sx?$/`)
- `exclude`: File patterns to exclude (default: `/node_modules/`)
- `flags.noTryCatchDisplayNames`: Skip try-catch wrapper around displayName assignment
- `flags.ignoreComponentSubstrings`: Array of substrings to ignore in component names

## Features

- ✅ Function component detection
- ✅ Class component detection  
- ✅ React.memo component detection
- ✅ React.forwardRef component detection
- ✅ Webpack 5 compatibility
- ✅ SWC-based transforms (no babel dependency)
- ✅ TypeScript support

## License

MIT
