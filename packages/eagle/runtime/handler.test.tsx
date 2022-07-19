import { test, expect } from "vitest";
import { handler } from "./handler";
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
test("response 404", async () => {
  const response = await handler(
    new Request("http://localhost:8787/notfound"),
    routes,
    hydrateRoutes
  );
  expect(response?.status).toBe(404);
});
