import { useState } from "react";

function AnotherComponent() {
  return <h1>Hello!</h1>;
}

export default function HelloWorld() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <AnotherComponent />
      Hello! Satoshi!
      <button
        onClick={() => {
          console.log("hello");
          // setCount(count + 1);
        }}
      >
        click
      </button>
      {/* <p>count: {count}</p> */}
    </div>
  );
}
