import type { Options } from '../types';

export function createFilter(include?: Options['include'], exclude?: Options['exclude']) {
  const includePatterns = normalizePatterns(include);
  const excludePatterns = normalizePatterns(exclude);

  return function filter(id: string): boolean {
    if (excludePatterns.some(pattern => testPattern(pattern, id))) {
      return false;
    }
    if (includePatterns.length === 0) {
      return true;
    }
    return includePatterns.some(pattern => testPattern(pattern, id));
  };
}

function normalizePatterns(patterns?: Options['include'] | Options['exclude']): Array<string | RegExp> {
  if (!patterns) return [];
  if (Array.isArray(patterns)) return patterns;
  return [patterns];
}

function testPattern(pattern: string | RegExp, id: string): boolean {
  if (pattern instanceof RegExp) {
    return pattern.test(id);
  }
  return minimatch(id, pattern);
}

function minimatch(id: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]');
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(id);
}
