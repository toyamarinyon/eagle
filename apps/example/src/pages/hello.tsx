import { useState } from "react";

export const pageProps = async () => {
  return {
    message: "Hello World",
  };
};

export const Page = (
  props: Awaited<ReturnType<typeof pageProps>>
): JSX.Element => {
  const [count, setCount] = useState(0);
  return (
    <div>
      {props.message}! developer!
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
};

export default Page;
