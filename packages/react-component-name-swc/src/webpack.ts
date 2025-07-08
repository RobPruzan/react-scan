import type { Compiler, WebpackPluginInstance } from 'webpack';
import { createFileFilter } from './utils/filter';
import { transform } from './transform';
import type { Options } from './types';
import { resolveOptions } from './types';

export class ReactComponentNamePlugin implements WebpackPluginInstance {
  private options: Options;
  private filter: (id: string) => boolean;

  constructor(options: Options = {}) {
    this.options = resolveOptions(options);
    this.filter = createFileFilter(this.options.include, this.options.exclude);
  }

  apply(compiler: Compiler): void {
    const pluginName = 'ReactComponentNamePlugin';

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          for (const assetName of Object.keys(assets)) {
            if (!this.filter(assetName)) {
              continue;
            }

            const asset = assets[assetName];
            const source = asset.source();
            const code = typeof source === 'string' ? source : source.toString();

            try {
              const result = transform(code, assetName, this.options);
              if (result) {
                compilation.updateAsset(assetName, new compiler.webpack.sources.RawSource(result.code));
              }
            } catch (error) {
              compilation.errors.push(
                new compiler.webpack.WebpackError(`ReactComponentNamePlugin: ${error}`)
              );
            }
          }
        }
      );
    });
  }
}

export default ReactComponentNamePlugin;
