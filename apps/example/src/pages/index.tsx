import { useState } from "react";

function AnotherComponent() {
  return <h1>Hello!</h1>;
}

export function PrepareProps() {
  return {
    message: "hello!",
  };
}

export default function HelloWorld(props: ReturnType<typeof PrepareProps>) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <AnotherComponent />
      {props.message}! Satoshi!
      <button
        onClick={() => {
          console.log("hello");
          setCount(count + 1);
        }}
      >
        click
      </button>
      <p>count: {count}</p>
    </div>
  );
}
