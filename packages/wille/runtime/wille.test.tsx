import { expect, test } from "vitest";
import { z } from "zod";
import { Wille } from "./wille";
import { Routes } from "./router";

const routes: Routes<typeof sessionScheme> = {
  ["index"]: async () => ({
    default: (props) => <div>{props.message}</div>,
    pageProps: async () => ({
      message: "hello world",
    }),
    handler: {
      POST: async (args) => {
        return new Response(
          `<div>current user id is ${args.session.userId}</div>`
        );
      },
    },
  }),
  ["hello"]: async () => ({ default: () => <div>hello</div> }),
  ["subdir/index"]: async () => ({ default: () => <div>subdir index</div> }),
  ["subdir/hello"]: async () => ({ default: () => <div>subdir hello</div> }),
};
const hydrateRoutes = {
  ["index"]: "function hydrate(){}",
  ["hello"]: "function hydrate(){}",
  ["subdir/index"]: "function hydrate(){}",
  ["subdir/hello"]: "function hydrate(){}",
};

const sessionScheme = z.object({
  userId: z.number(),
});

test("create Wille", async () => {
  const wille = new Wille(routes, hydrateRoutes, {
    session: {
      scheme: sessionScheme,
      secret: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
    },
  });
  const response1 = await wille.handleRequest(
    new Request("http://localhost:8787", {
      headers: {
        cookie: "session=Ekvxbb%2F1pRAsZZWq--%2FybF8SeKlgnR%2FKn7eEiFeA%3D%3D",
      },
    })
  );
  expect(await response1.text()).toMatchInlineSnapshot(`
    "<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div id=\\"eagle-root\\"><div>hello world</div></div>
    <script type=\\"module\\"></script></body></html>"
  `);

  const response2 = await wille.handleRequest(
    new Request("http://localhost:8787", {
      method: "POST",
      headers: {
        cookie: "session=Ekvxbb%2F1pRAsZZWq--%2FybF8SeKlgnR%2FKn7eEiFeA%3D%3D",
      },
    })
  );
  expect(await response2.text()).toMatchInlineSnapshot(
    '"<div>current user id is 1</div>"'
  );
});

test("without session", async () => {
  const routes2: Routes = {
    ["index"]: async () => ({
      default: (props) => <div>{props.message}</div>,
      pageProps: async () => ({
        message: "hello world",
      }),
      handler: {
        POST: async () => {
          return new Response(`<div>without session</div>`);
        },
      },
    }),
    ["hello"]: async () => ({ default: () => <div>hello</div> }),
    ["subdir/index"]: async () => ({ default: () => <div>subdir index</div> }),
    ["subdir/hello"]: async () => ({ default: () => <div>subdir hello</div> }),
  };
  const eagle = new Wille(routes2, hydrateRoutes);
  const response1 = await eagle.handleRequest(
    new Request("http://localhost:8787")
  );
  expect(await response1.text()).toMatchInlineSnapshot(`
    "<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div id=\\"eagle-root\\"><div>hello world</div></div>
    <script type=\\"module\\"></script></body></html>"
  `);

  const response2 = await eagle.handleRequest(
    new Request("http://localhost:8787", {
      method: "POST",
    })
  );
  expect(await response2.text()).toMatchInlineSnapshot(
    '"<div>without session</div>"'
  );
});
