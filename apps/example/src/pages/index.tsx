import { useState } from "react";
import { Title } from "../components/title";
import { container } from "../styles/styles.css";

function AnotherComponent() {
  return <h1>Hello!</h1>;
}

export default function HelloWorld() {
  const [count, setCount] = useState(0);
  return (
    <div
      className={container}
      style={{
        color: "white",
      }}
    >
      <AnotherComponent />
      <Title />
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        click
      </button>
      <p>count: {count}</p>
    </div>
  );
}
