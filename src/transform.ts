import { transformSync } from '@swc/core';
import type { Options, TransformResult } from './types';
import { isComponentishName } from './utils/is-componentish-name';

const REACT_CLASS = ['Component', 'PureComponent'];
const REACT_FACTORY = ['forwardRef', 'memo', 'createClass', 'createContext'];

export function transform(code: string, filename: string, options?: Options): TransformResult | null {
  try {
    const transformedCode = transformWithRegex(code, options);
    
    const result = transformSync(transformedCode, {
      filename,
      jsc: {
        parser: {
          syntax: filename.endsWith('.tsx') || filename.endsWith('.ts') ? 'typescript' : 'ecmascript',
          tsx: filename.endsWith('.tsx'),
          jsx: filename.endsWith('.jsx') || filename.endsWith('.tsx'),
          decorators: true,
        },
        transform: {
          react: {
            pragma: 'React.createElement',
            pragmaFrag: 'React.Fragment',
          },
        },
      },
      module: {
        type: 'es6',
      },
      sourceMaps: true,
    });

    if (typeof result === 'string') {
      return { code: result };
    }

    return {
      code: result.code,
      map: result.map ? JSON.stringify(result.map) : undefined,
    };
  } catch (error) {
    console.error('Error transforming file:', filename, error);
    return null;
  }
}

function transformWithRegex(code: string, options?: Options): string {
  const assignedNames = getAssignedDisplayNames(code);
  let transformedCode = code;
  
  transformedCode = transformedCode.replace(
    /^(\s*)(export\s+)?(function\s+([A-Z][a-zA-Z0-9_]*)\s*\([^)]*\)\s*\{[\s\S]*?\n\s*\})/gm,
    (match, indent, exportKeyword, funcDecl, funcName) => {
      if (!isComponentishName(funcName, options?.flags) || assignedNames.has(funcName)) {
        return match;
      }
      const displayNameAssignment = createDisplayNameAssignment(funcName, options?.flags?.noTryCatchDisplayNames);
      return match + '\n' + indent + displayNameAssignment;
    }
  );

  transformedCode = transformedCode.replace(
    /^(\s*)(export\s+)?(const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*:\s*[^=]*=>\s*|[a-zA-Z_$][a-zA-Z0-9_$]*\s*=>\s*)[\s\S]*?;?)\s*$/gm,
    (match, indent, exportKeyword, varDecl, varName) => {
      if (!isComponentishName(varName, options?.flags) || assignedNames.has(varName)) {
        return match;
      }
      
      if (isLikelyReactComponent(match)) {
        const displayNameAssignment = createDisplayNameAssignment(varName, options?.flags?.noTryCatchDisplayNames);
        return match + '\n' + indent + displayNameAssignment;
      }
      
      return match;
    }
  );

  transformedCode = transformedCode.replace(
    /^(\s*)(export\s+)?(const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*React\.(memo|forwardRef|createContext)\s*\([\s\S]*?\);?)\s*$/gm,
    (match, indent, exportKeyword, varDecl, varName, reactMethod) => {
      if (!isComponentishName(varName, options?.flags) || assignedNames.has(varName)) {
        return match;
      }
      
      if (reactMethod === 'createContext' && options?.flags?.noCreateContext) {
        return match;
      }
      
      const displayNameAssignment = createDisplayNameAssignment(varName, options?.flags?.noTryCatchDisplayNames);
      return match + '\n' + indent + displayNameAssignment;
    }
  );

  transformedCode = transformedCode.replace(
    /^(\s*)(export\s+)?(class\s+([A-Z][a-zA-Z0-9_]*)\s+extends\s+(?:React\.)?(?:Component|PureComponent)[\s\S]*?\n\s*\})/gm,
    (match, indent, exportKeyword, classDecl, className) => {
      if (!isComponentishName(className, options?.flags) || assignedNames.has(className)) {
        return match;
      }
      const displayNameAssignment = createDisplayNameAssignment(className, options?.flags?.noTryCatchDisplayNames);
      return match + '\n' + indent + displayNameAssignment;
    }
  );

  if (!options?.flags?.noStyledComponents) {
    transformedCode = transformedCode.replace(
      /^(\s*)(export\s+)?(const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*styled[\s\S]*?;?)\s*$/gm,
      (match, indent, exportKeyword, varDecl, varName) => {
        if (!isComponentishName(varName, options?.flags) || assignedNames.has(varName)) {
          return match;
        }
        const displayNameAssignment = createDisplayNameAssignment(varName, options?.flags?.noTryCatchDisplayNames);
        return match + '\n' + indent + displayNameAssignment;
      }
    );
  }

  return transformedCode;
}

function getAssignedDisplayNames(code: string): Set<string> {
  const names = new Set<string>();
  const displayNameRegex = /([A-Z][a-zA-Z0-9_]*)\.displayName\s*=/g;
  let match;
  
  while ((match = displayNameRegex.exec(code)) !== null) {
    names.add(match[1]);
  }
  
  return names;
}

function isLikelyReactComponent(code: string): boolean {
  if (/<[A-Z]/.test(code) || /return\s*</.test(code) || /=>\s*</.test(code)) {
    return true;
  }
  
  if (/use[A-Z]/.test(code)) {
    return true;
  }
  
  if (/\(\s*props\s*[,)]/.test(code) || /\(\s*\{\s*[a-zA-Z]/.test(code)) {
    return true;
  }
  
  return false;
}

function createDisplayNameAssignment(name: string, noTryCatch?: boolean): string {
  const assignment = `${name}.displayName = "${name}";`;
  
  if (noTryCatch) {
    return assignment;
  }
  
  return `try { ${assignment} } catch (error) {}`;
}
