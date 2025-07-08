import { transform } from '../src/transform';

describe('transform', () => {
  it('should add displayName to function components', () => {
    const code = `
      function MyComponent() {
        return <div>Hello</div>;
      }
    `;
    
    const result = transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('MyComponent.displayName');
  });

  it('should add displayName to arrow function components', () => {
    const code = `
      const MyComponent = () => {
        return <div>Hello</div>;
      };
    `;
    
    const result = transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('MyComponent.displayName');
  });

  it('should add displayName to class components', () => {
    const code = `
      class MyComponent extends React.Component {
        render() {
          return <div>Hello</div>;
        }
      }
    `;
    
    const result = transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('MyComponent.displayName');
  });

  it('should not add displayName to non-component functions', () => {
    const code = `
      function myUtilFunction() {
        return 'hello';
      }
    `;
    
    const result = transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).not.toContain('myUtilFunction.displayName');
  });

  it('should not add displayName if already exists', () => {
    const code = `
      function MyComponent() {
        return <div>Hello</div>;
      }
      MyComponent.displayName = 'CustomName';
    `;
    
    const result = transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    const matches = result!.code.match(/MyComponent\.displayName/g);
    expect(matches).toHaveLength(1);
  });

  it('should handle React.memo components', () => {
    const code = `
      const MyComponent = React.memo(() => {
        return <div>Hello</div>;
      });
    `;
    
    const result = transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('MyComponent.displayName');
  });

  it('should handle forwardRef components', () => {
    const code = `
      const MyComponent = React.forwardRef((props, ref) => {
        return <div ref={ref}>Hello</div>;
      });
    `;
    
    const result = transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('MyComponent.displayName');
  });
});
