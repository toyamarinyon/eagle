import { test, expect, describe, vi } from "vitest";
import { z } from "zod";
import { Meave } from "./meave";
import { createHandler } from "./handlerBuilder";

vi.mock("__STATIC_CONTENT_MANIFEST", () => {});
describe("handlerBuilder", () => {
  test("be able to build handler", async () => {
    const handler = createHandler();
    expect(handler).not.toBeUndefined();
  });
  test("be able to add action", async () => {
    const fn = vi.fn().mockImplementation(() => new Response("foo"));
    const handler = createHandler().addAction("foo", {
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
    const handler = createHandler().addPropsBuilder(fn);
    const props = handler.propsBuilder;
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
    const handler = createHandler<typeof app>().addAction("foo", {
      resolve: async () => new Response("foo"),
    });
  });
});
