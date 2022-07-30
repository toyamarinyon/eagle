import { useState } from "react";

function AnotherComponent() {
  return <h1>Hello!</h1>;
}

export async function PageProps() {
  return {
    message: "hello!",
  };
}

export default function HelloWorld(props: Record<string, any>) {
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
