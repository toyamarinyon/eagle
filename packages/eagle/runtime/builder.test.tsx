import { expect, test } from "vitest";
import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject, z } from "zod";
import { createEagle, Eagle } from "./builder";
import { Routes } from "./router";

const routes: Routes = {
  ["index"]: async () => ({
    default: (props) => <div>{props.message}</div>,
    PageProps: () => ({
      message: "hello world",
    }),
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

test("createEagle", async () => {
  const eagle = createEagle(routes, hydrateRoutes);
  const response = await eagle.handleRequest(
    new Request("http://localhost:8787")
  );
  expect(await response.text()).toMatchInlineSnapshot(`
    "<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div id=\\"eagle-root\\"><div>hello world</div></div>
    <script type=\\"module\\">
    function hydrate(){}
    </script></body></html>"
  `);
});

type inferAnyZodObject<T> = T extends AnyZodObject ? T : never;
type inferEagleSession<T> = T extends Eagle<infer U extends AnyZodObject> ? T['webCryptSession'] : never;

export type Handler<T> = (req: Request, session: inferEagleSession<T>) => Promise<Response>;

interface PageHandler<T = any> {
  POST?: Handler<T>;
}


test("createEagle with session", async () => {
  const sessionScheme = z.object({
    userId: z.string(),
  });
  const eagle = createEagle(routes, hydrateRoutes, {
    session: {
      scheme: sessionScheme,
      secret: "hello",
    },
  });
  type b = typeof eagle;
  type a = inferEagleSession<b>;
  const handler: Handler<typeof eagle> = async (req, session) =>{
    return new Response("hello");

  }
  const response = await eagle.handleRequest(
    new Request("http://localhost:8787")
  );
});
