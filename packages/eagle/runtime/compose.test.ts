import { expect, test, vi } from "vitest";
import { compose } from "./compose";
import { Handler } from "./handler";
import { Middleware } from "./middleware";

test("compose", async () => {
  const m1: Middleware = {
    onResponse: async (response) => {
      const headers = response.headers;
      headers.append("Cookie", "foo=bar");
      return new Response(response.body, { ...response, headers });
    },
  };
  const handlerMock = vi
    .fn()
    .mockImplementation(() => new Response("Test Response"));
  const handler: Handler = handlerMock;
  const composed = compose([m1]);

  const request = new Request("http://localhost:3000/");
  const response = await composed(request, handler);
  expect(await response.text()).toBe("Test Response");
  expect(response.headers.get("Cookie")).toBe("foo=bar");
});
