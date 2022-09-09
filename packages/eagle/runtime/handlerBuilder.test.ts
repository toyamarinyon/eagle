import { test, expect, describe, vi } from "vitest";
import { z } from "zod";
import { Meave } from "./meave";
import { pageHandler } from "./handlerBuilder";

vi.mock("__STATIC_CONTENT_MANIFEST", () => {});
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
    await handler.actionHandlers["foo"].resolve({} as any);
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
  test("session", () => {
    const sessionScheme = z.object({
      name: z.string(),
    });
    interface Env {
      MY_KV_NAMESPACE: KVNamespace;
    }
    const app = new Meave<typeof sessionScheme, Env>(
      {},
      { session: { scheme: sessionScheme, secret: "secret" } }
    );
    const handler = pageHandler<typeof app>().addAction("foo", {
      resolve: async () => new Response("foo"),
    });
  });
});
