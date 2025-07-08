import React from 'react';

function MyButton() {
  return <button>Click me</button>;
}

const MyInput = () => {
  return <input type="text" />;
};

class MyCard extends React.Component {
  render() {
    return <div className="card">Card content</div>;
  }
}

const MyMemoComponent = React.memo(({ title }) => {
  return <h1>{title}</h1>;
});

const MyForwardRefComponent = React.forwardRef((props, ref) => {
  return <div ref={ref}>Forward ref component</div>;
});

const MyContext = React.createContext();

const withAuthHOC = (Component) => {
  return function AuthenticatedComponent(props) {
    return <Component {...props} />;
  };
};

export {
  MyButton,
  MyInput,
  MyCard,
  MyMemoComponent,
  MyForwardRefComponent,
  MyContext,
  withAuthHOC,
};
