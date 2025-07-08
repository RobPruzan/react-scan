import type { Compiler, WebpackPluginInstance } from 'webpack';
import { transform } from './transform';
import { createFilter } from './utils/filter';
import type { Options } from './types';

const DEFAULT_INCLUDE = /\.[cm]?[jt]sx?$/;
const DEFAULT_EXCLUDE = [
  /node_modules/,
  /\/_app\.[jt]sx?$/,
  /\/_document\.[jt]sx?$/,
  /\/api\//,
  /\/\.million\//,
];

export class ReactComponentNamePlugin implements WebpackPluginInstance {
  private options: Options;
  private filter: (id: string) => boolean;

  constructor(options: Options = {}) {
    this.options = options;
    this.filter = createFilter(
      options.include || DEFAULT_INCLUDE,
      options.exclude || DEFAULT_EXCLUDE
    );
  }

  apply(compiler: Compiler): void {
    const pluginName = 'ReactComponentNamePlugin';

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          for (const [filename, asset] of Object.entries(assets)) {
            if (!this.filter(filename)) {
              continue;
            }

            const source = asset.source();
            if (typeof source !== 'string') {
              continue;
            }

            const result = transform(source, filename, this.options);
            if (result && result.code !== source) {
              const { RawSource } = compiler.webpack.sources;
              compilation.updateAsset(filename, new RawSource(result.code));
            }
          }
        }
      );
    });
  }
}

export default ReactComponentNamePlugin;
