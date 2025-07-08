import { createFilter } from '@rollup/pluginutils';
import type { FilterPattern } from '@rollup/pluginutils';

export const DEFAULT_INCLUDE = [/\.[cm]?[jt]sx?$/];
export const DEFAULT_EXCLUDE = [/node_modules/];

export function createFileFilter(include?: FilterPattern, exclude?: FilterPattern) {
  return createFilter(
    include || DEFAULT_INCLUDE,
    exclude || DEFAULT_EXCLUDE
  );
}
