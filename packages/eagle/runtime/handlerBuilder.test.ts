import { test, expect, describe, vi } from "vitest";
import { pageHandler } from "./handlerBuilder";

describe("handlerBuilder", () => {
  test("be able to build handler", async () => {
    const handler = pageHandler();
    expect(handler).not.toBeUndefined();
  });
  test("be able to add action", async () => {
    const fn = vi.fn().mockImplementation(() => new Response("foo"));
    const handler = pageHandler().addAction("foo", {
      resolve: fn,
    });
    expect(handler).not.toBeUndefined();
    expect(Object.keys(handler.actionHandlers)).toStrictEqual(["foo"]);
    await handler.actionHandlers["foo"].resolve();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test("be able to add props builder", async () => {
    const fn = vi.fn().mockImplementation(() => ({
      name: "hello",
    }));
    const handler = pageHandler().addPropsBuilder(fn);
    const props = await handler.propsBuilder();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(props).toStrictEqual({ name: "hello" });
  });
});
