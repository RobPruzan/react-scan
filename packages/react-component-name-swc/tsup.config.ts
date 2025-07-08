import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/webpack.ts',
    './src/loader.ts'
  ],
  outDir: './dist',
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['cjs', 'esm'],
  target: 'esnext',
  external: [
    '@swc/core',
    '@rollup/pluginutils',
    'webpack',
    'webpack-sources'
  ],
  dts: true,
  minify: false,
  treeshake: true,
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.mjs' : '.js',
  }),
  esbuildOptions: (options, context) => {
    options.mainFields = ['module', 'main'];
    options.conditions = ['import', 'require', 'node', 'default'];
    options.format = context.format === 'esm' ? 'esm' : 'cjs';
    options.preserveSymlinks = true;
  },
});
