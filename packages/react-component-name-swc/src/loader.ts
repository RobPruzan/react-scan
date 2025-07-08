import { createFileFilter, DEFAULT_EXCLUDE, DEFAULT_INCLUDE } from './utils/filter';
import { transform } from './transform';
import type { Options } from './types';
import type { FilterPattern } from '@rollup/pluginutils';

interface LoaderContext {
  getOptions(): { include?: FilterPattern; exclude?: FilterPattern; flags?: Options['flags'] };
  resourcePath: string;
  async(): (
    error: Error | null,
    content?: string,
    sourceMap?: string | object,
  ) => void;
}

export default async function ReactComponentNameLoader(
  this: LoaderContext,
  code: string,
  sourceMap: string | object | undefined,
) {
  const parsedMap =
    typeof sourceMap === 'string' ? JSON.parse(sourceMap) : sourceMap;
  const callback = this.async();
  try {
    const options = this.getOptions();
    const id = this.resourcePath;
    const filter = createFileFilter(
      options?.include || DEFAULT_INCLUDE,
      options?.exclude || [
        ...DEFAULT_EXCLUDE,
        '**/_app.{jsx,tsx,js,ts}',
        '**/_document.{jsx,tsx,js,ts}',
        '**/api/**/*',
        '**/.million/**/*',
      ],
    );
    if (!filter(id)) return callback(null, code, parsedMap);

    const result = transform(code, id, { flags: options?.flags });

    callback(
      null,
      result?.code || code,
      result?.map ? JSON.stringify(result.map) : undefined,
    );
  } catch (e) {
    callback(e as Error);
  }
}
