const ReactComponentNamePlugin = require('react-component-name-swc/webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  pragma: 'React.createElement',
                  pragmaFrag: 'React.Fragment',
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new ReactComponentNamePlugin({
      include: [/\.jsx?$/, /\.tsx?$/],
      exclude: [
        /node_modules/,
        /\/_app\.[jt]sx?$/,
        /\/_document\.[jt]sx?$/,
        /\/api\//,
      ],
      flags: {
        noTryCatchDisplayNames: false,
        noStyledComponents: false,
        noCreateContext: false,
        ignoreComponentSubstrings: ['HOC', 'withAuth'],
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
