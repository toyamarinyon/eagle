import { test, expect } from "vitest";
import { handler } from "./handler";

const routes = {
  ["index"]: async () => ({ default: () => <div>index</div> }),
  ["hello"]: async () => ({ default: () => <div>hello</div> }),
  ["subdir/index"]: async () => ({ default: () => <div>subdir index</div> }),
  ["subdir/hello"]: async () => ({ default: () => <div>subdir hello</div> }),
};
test("response html", async () => {
  const response = await handler(new Request("http://localhost:8787"), routes);
  expect(await response?.text()).toMatchInlineSnapshot(
    '"<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div>index</div></body></html>"'
  );
  expect(response?.headers.get("content-type")).toBe("text/html;charset=UTF-8");
});
test("response 404", async () => {
  const response = await handler(
    new Request("http://localhost:8787/notfound"),
    routes
  );
  expect(response?.status).toBe(404);
});
