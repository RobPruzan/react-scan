export interface Options {
  include?: string | RegExp | Array<string | RegExp>;
  exclude?: string | RegExp | Array<string | RegExp>;
  flags?: {
    noTryCatchDisplayNames?: boolean;
    noStyledComponents?: boolean;
    noCreateContext?: boolean;
    ignoreComponentSubstrings?: Array<string>;
  };
}

export interface TransformResult {
  code: string;
  map?: string;
}
