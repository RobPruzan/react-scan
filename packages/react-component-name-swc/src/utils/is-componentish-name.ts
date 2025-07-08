import type { Options } from '../types';

export function isComponentishName(name: string, flags: Options['flags']) {
  return (
    name[0] >= 'A' &&
    name[0] <= 'Z' &&
    !flags?.ignoreComponentSubstrings?.some((substring) =>
      name.includes(substring),
    )
  );
}
