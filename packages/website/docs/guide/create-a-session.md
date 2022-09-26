# Create a session

It appears several Web Frameworks in few years, each of them are great features, but almost one doesn't have session management.

While I thought it was a reasonable decision, as Session management is sometimes unnecessary, I also thought it was a bit inconvenient.

Therefore, Wille have a session management.

## Session has scheme

Wille's session management requires the following scheme that defined with Zod:

```tsx
import { z } from "zod";

const sessionScheme = z.object({
  username: z.string(),
});
```

## Example
Then, set scheme to option for Wille to you can get the session in page handler.

```tsx
// src/index.ts
import { wille } from "$wille";
import { z } from "zod";

export interface Env {}

const sessionScheme = z.object({
  username: z.string(),
});
export const app = wille({
  session: {
    scheme: sessionScheme,
    secret: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
  },
});
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return app.handleRequest(request, env, ctx);
  },
};
```

```tsx
// src/pages/login-only-page.tsx
import { createHandler, inferProps } from "wille/handler";
import { app } from "..";
import { Layout } from "../components/layout";
import { Heading } from "../components/typography";
import { sprinkles } from "../styles/sprinkles.css";

export const handler = createHandler<typeof app>()
  /**
   * `addGuard` is a method to prevent a page from being rendered by
   * the request context.
   * For example, redirect user to the login page if user it not logged in
   */
  .addGuard(async ({ session }) => {
    if (session.username == null) {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/login",
        },
      });
    }
  })
  .addPropsResolver(async ({ session }) => {
    return {
      username: session.username,
    };
  });

export const Page = ({ username }: inferProps<typeof handler>): JSX.Element => {
  return <p>username: {username}</p>;
};

export default Page;
```

This alone may not be very clear, so please go through the tutorial for a better understanding.
