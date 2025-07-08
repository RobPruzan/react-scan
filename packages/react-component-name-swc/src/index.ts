export { transform } from './transform';
export { ReactComponentNamePlugin } from './webpack';
export { default as ReactComponentNameLoader } from './loader';
export type { Options, OptionsResolved, TransformResult } from './types';
export { resolveOptions } from './types';
export { isComponentishName } from './utils/is-componentish-name';
export { createFileFilter, DEFAULT_INCLUDE, DEFAULT_EXCLUDE } from './utils/filter';

export const DEFAULT_OPTIONS = {
  include: [/\.[cm]?[jt]sx?$/],
  exclude: [/node_modules/],
  enforce: 'pre' as const,
  flags: {},
};
