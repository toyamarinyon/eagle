import { test, expect } from "vitest";
import { handler } from "./handler";

const routes = {
  ["index"]: async () => ({ default: async () => <div>index</div> }),
  ["hello"]: async () => ({ default: async () => <div>hello</div> }),
  ["subdir/index"]: async () => ({ default: async () => <div>subdir index</div> }),
  ["subdir/hello"]: async () => ({ default: async () => <div>subdir hello</div> }),
};
test("response html", async () => {
  const response = await handler(new Request("http://localhost:8787"), routes);
  expect(await response?.text()).toBe("<div>index</div>");
  expect(response?.headers.get("content-type")).toBe("text/html;charset=UTF-8");
});
test("response 404", async() => {
  const response = await handler(new Request("http://localhost:8787/notfound"), routes);
  expect(response?.status).toBe(404);

})