import { PageProps } from "meave";

import { useState } from "react";
import { app } from "..";
import { Title } from "../components/title";
import { container } from "../styles/styles.css";

function AnotherComponent() {
  return <h1>Hello!</h1>;
}

export const pageProps: PageProps<
  inferEagleSession<typeof app>,
  {
    message: string;
  }
> = async ({ session }) => {
  const username = session.userId ?? "guest";
  return {
    message: username,
  };
};

export default function HelloWorld(
  props: Awaited<ReturnType<typeof pageProps>>
) {
  const [count, setCount] = useState(0);
  return (
    <div className={container}>
      <AnotherComponent />
      <Title />
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
