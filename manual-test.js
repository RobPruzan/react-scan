const { transform } = require('./dist/index.js');

const testCases = [
  {
    name: 'Function component',
    code: `function MyComponent() {
  return <div>Hello</div>;
}`
  },
  {
    name: 'Arrow function component',
    code: `const MyComponent = () => {
  return <div>Hello</div>;
}`
  },
  {
    name: 'Class component',
    code: `class MyComponent extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}`
  },
  {
    name: 'React.memo component',
    code: `const MyComponent = React.memo(() => {
  return <div>Hello</div>;
});`
  },
  {
    name: 'React.forwardRef component',
    code: `const MyComponent = React.forwardRef((props, ref) => {
  return <div ref={ref}>Hello</div>;
});`
  }
];

console.log('Testing SWC-based React Component Name Transform\n');

testCases.forEach(({ name, code }) => {
  console.log(`\n--- ${name} ---`);
  console.log('Input:');
  console.log(code);
  
  try {
    const result = transform(code, 'test.jsx');
    if (result) {
      console.log('\nOutput:');
      console.log(result.code);
      
      const hasDisplayName = result.code.includes('.displayName');
      console.log(`\n✅ Transform ${hasDisplayName ? 'SUCCESS' : 'FAILED'}: ${hasDisplayName ? 'displayName added' : 'no displayName found'}`);
    } else {
      console.log('\n❌ Transform FAILED: null result');
    }
  } catch (error) {
    console.log('\n❌ Transform ERROR:', error.message);
  }
});
