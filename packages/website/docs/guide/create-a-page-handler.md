# Create a page handler

Page handler is allows you to define some processes before render a page component. It is similar to `getServerSideProps` in Next.js and `Custom Handler` in Fresh.

Page handlers are functions exported from a page file named `handler`; you can define page handlers using helper functions provided by Wille.

```tsx
// src/pages/hello-handler.tsx
import { createHandler } from "wille/handler";

export const handler = createHandler();

const Page = (): JSX.Element => {
  return <div>Hello</div>;
};
```

`createHandler` helper function returns PageHandler class. First, let's define props resolver to set props for the page component.

```tsx
// src/pages/hello-handler.tsx
import { createHandler } from "wille/handler";

export const handler = createHandler().addPropsResolver(async () => {
  return {
    message: "hello",
  };
});

const Page = (): JSX.Element => {
  return <div>Hello</div>;
};
```

Next, let use the `inferProps` type to get inferred typings for handler.

```tsx
// src/pages/hello-handler.tsx
import { createHandler, inferProps } from "wille/handler";

export const handler = createHandler().addPropsResolver(async () => {
  return {
    message: "hello",
  };
});

const Page = (props: inferProps<typeof handler>): JSX.Element => {
  return <div>{props.message}</div>;
};
```

## 