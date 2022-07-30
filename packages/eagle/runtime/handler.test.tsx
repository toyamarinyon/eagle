import { test, expect, describe } from "vitest";
import { createWebCryptSession } from "webcrypt-session";
import { z } from "zod";
import { handler } from "./handler";
import { Routes } from "./router";

const routes: Routes = {
  ["index"]: async () => ({
    default: (props) => <div>{props.message}</div>,
    PageProps: async () => ({
      message: "hello world",
    }),
    handler: {
      POST: async () => {
        return new Response(
          JSON.stringify({
            message: "hello",
          }),
          {
            headers: new Headers({
              "Content-Type": "application/json",
            }),
          }
        );
      },
    },
  }),
  ["hello"]: async () => ({ default: () => <div>hello</div> }),
  ["subdir/index"]: async () => ({ default: () => <div>subdir index</div> }),
  ["subdir/hello"]: async () => ({ default: () => <div>subdir hello</div> }),
  ["signIn"]: async () => ({
    default: () => <div>signIn</div>,
    handler: {
      POST: async ({ req }) => {
        const body = await req.formData();
        const email = body.get("email");
        return new Response(`<div>Submit email is ${email}</div>`);
      },
    },
  }),
};
const hydrateRoutes = {
  ["index"]: "function hydrate(){}",
  ["hello"]: "function hydrate(){}",
  ["subdir/index"]: "function hydrate(){}",
  ["subdir/hello"]: "function hydrate(){}",
  ["signIn"]: "function hydrate(){}",
};

test("response html", async () => {
  const response = await handler(
    new Request("http://localhost:8787"),
    routes,
    hydrateRoutes
  );
  expect(await response?.text()).toMatchInlineSnapshot(
    `
    "<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div id=\\"eagle-root\\"><div>hello world</div></div>
    <script type=\\"module\\">
    function hydrate(){}
    </script></body></html>"
  `
  );
  expect(response?.headers.get("content-type")).toBe("text/html;charset=UTF-8");
});

describe("POST", () => {
  test("response POST handler", async () => {
    const response = await handler(
      new Request("http://localhost:8787", { method: "POST" }),
      routes,
      hydrateRoutes
    );
    expect(await response?.json()).toMatchInlineSnapshot(`
    {
      "message": "hello",
    }
  `);
  });
  test("with request", async () => {
    const response = await handler(
      new Request("http://localhost:8787/signIn", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        }),
        body: new URLSearchParams({
          email: "toyamarinyon@gmail.com",
        }).toString(),
      }),
      routes,
      hydrateRoutes
    );
    expect(await response?.text()).toMatchInlineSnapshot(
      '"<div>Submit email is toyamarinyon@gmail.com</div>"'
    );
  });
});

test("response 404", async () => {
  const response = await handler(
    new Request("http://localhost:8787/notfound"),
    routes,
    hydrateRoutes
  );
  expect(response?.status).toBe(404);
});

test("session", async () => {
  const sessionScheme = z.object({
    userId: z.number(),
  });

  const request = new Request("http://localhost:8787", {
    headers: {
      cookie: "session=Ekvxbb%2F1pRAsZZWq--%2FybF8SeKlgnR%2FKn7eEiFeA%3D%3D",
    },
  });
  const webCryptSession = await createWebCryptSession(sessionScheme, request, {
    password: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
  });
  expect(webCryptSession.userId).toBe(1);
  const routesWithSession: Routes<typeof sessionScheme> = {
    ["index"]: async () => ({
      PageProps: async ({ session }) => {
        return {
          message: session.userId,
        };
      },
      default(props) {
        return <div>message: {props.message}</div>;
      },
    }),
  };
  const hydrateRoutesWithSession = {
    ["index"]: "function hydrate(){}",
  };
  const response = await handler(
    request,
    routesWithSession,
    hydrateRoutesWithSession,
    webCryptSession
  );
  expect(await response?.text()).toMatchInlineSnapshot(`
    "<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div id=\\"eagle-root\\"><div>message: <!-- -->1</div></div>
    <script type=\\"module\\">
    function hydrate(){}
    </script></body></html>"
  `);
});
