import type { Options, TransformResult } from './types';
import { isComponentishName } from './utils/is-componentish-name';

export function transform(
  code: string,
  filename: string,
  options: Options = {}
): TransformResult | null {
  try {
    const { flags } = options;
    let transformedCode = code;
    let hasChanges = false;

    const functionComponentRegex = /function\s+([A-Z][a-zA-Z0-9_]*)\s*\([^)]*\)\s*\{/g;
    let match;
    while ((match = functionComponentRegex.exec(code)) !== null) {
      const componentName = match[1];
      if (isComponentishName(componentName, flags)) {
        const displayNameAssignment = flags?.noTryCatchDisplayNames
          ? `${componentName}.displayName = "${componentName}";`
          : `try { ${componentName}.displayName = "${componentName}"; } catch (error) {}`;
        
        if (!transformedCode.includes(`${componentName}.displayName`)) {
          const functionEnd = findFunctionEnd(transformedCode, match.index);
          if (functionEnd !== -1) {
            transformedCode = 
              transformedCode.slice(0, functionEnd + 1) + 
              '\n' + displayNameAssignment + 
              transformedCode.slice(functionEnd + 1);
            hasChanges = true;
          }
        }
      }
    }

    const variableComponentRegex = /(?:const|let|var)\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*(React\.memo\(|React\.forwardRef\(|\([^)]*\)\s*=>\s*\{)/g;
    while ((match = variableComponentRegex.exec(code)) !== null) {
      const componentName = match[1];
      if (isComponentishName(componentName, flags)) {
        const displayNameAssignment = flags?.noTryCatchDisplayNames
          ? `${componentName}.displayName = "${componentName}";`
          : `try { ${componentName}.displayName = "${componentName}"; } catch (error) {}`;
        
        if (!transformedCode.includes(`${componentName}.displayName`)) {
          const lineEnd = findLineEnd(transformedCode, match.index);
          if (lineEnd !== -1) {
            transformedCode = 
              transformedCode.slice(0, lineEnd) + 
              '\n' + displayNameAssignment + 
              transformedCode.slice(lineEnd);
            hasChanges = true;
          }
        }
      }
    }

    const classComponentRegex = /class\s+([A-Z][a-zA-Z0-9_]*)\s+extends\s+(?:React\.)?(?:Component|PureComponent)/g;
    while ((match = classComponentRegex.exec(code)) !== null) {
      const componentName = match[1];
      if (isComponentishName(componentName, flags)) {
        const displayNameAssignment = flags?.noTryCatchDisplayNames
          ? `${componentName}.displayName = "${componentName}";`
          : `try { ${componentName}.displayName = "${componentName}"; } catch (error) {}`;
        
        if (!transformedCode.includes(`${componentName}.displayName`)) {
          const classEnd = findClassEnd(transformedCode, match.index);
          if (classEnd !== -1) {
            transformedCode = 
              transformedCode.slice(0, classEnd + 1) + 
              '\n' + displayNameAssignment + 
              transformedCode.slice(classEnd + 1);
            hasChanges = true;
          }
        }
      }
    }

    return hasChanges ? { code: transformedCode } : null;
  } catch (error) {
    console.error('Error processing file:', filename, error);
    return null;
  }
}

function findFunctionEnd(code: string, startIndex: number): number {
  let braceCount = 0;
  let inFunction = false;
  
  for (let i = startIndex; i < code.length; i++) {
    const char = code[i];
    if (char === '{') {
      braceCount++;
      inFunction = true;
    } else if (char === '}') {
      braceCount--;
      if (inFunction && braceCount === 0) {
        return i;
      }
    }
  }
  return -1;
}

function findClassEnd(code: string, startIndex: number): number {
  let braceCount = 0;
  let inClass = false;
  
  for (let i = startIndex; i < code.length; i++) {
    const char = code[i];
    if (char === '{') {
      braceCount++;
      inClass = true;
    } else if (char === '}') {
      braceCount--;
      if (inClass && braceCount === 0) {
        return i;
      }
    }
  }
  return -1;
}

function findLineEnd(code: string, startIndex: number): number {
  let braceCount = 0;
  let parenCount = 0;
  let inStatement = false;
  
  for (let i = startIndex; i < code.length; i++) {
    const char = code[i];
    
    if (char === '=' && !inStatement) {
      inStatement = true;
      continue;
    }
    
    if (!inStatement) continue;
    
    if (char === '(') parenCount++;
    else if (char === ')') parenCount--;
    else if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    else if (char === ';' && braceCount === 0 && parenCount === 0) {
      return i + 1;
    } else if (char === '\n' && braceCount === 0 && parenCount === 0) {
      let j = i - 1;
      while (j >= 0 && /\s/.test(code[j])) j--;
      if (j >= 0 && (code[j] === '}' || code[j] === ')')) {
        return i;
      }
    }
  }
  return -1;
}
