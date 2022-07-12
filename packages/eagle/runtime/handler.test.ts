import { test, expect } from "vitest";
import { handler } from "./handler";

const routes = {
  ["index"]: async () => ({ default: async () => "index" }),
  ["hello"]: async () => ({ default: async () => "hello" }),
  ["subdir/index"]: async () => ({ default: async () => "subdir index" }),
  ["subdir/hello"]: async () => ({ default: async () => "subdir hello" }),
};
test("response html", async () => {
  const response = await handler(new Request("http://localhost:8787"), routes);
  expect(await response?.text()).toBe("index");
  expect(response?.headers.get("content-type")).toBe("text/html;charset=UTF-8");
});
test("response 404", async() => {
  const response = await handler(new Request("http://localhost:8787/notfound"), routes);
  expect(response?.status).toBe(404);

})