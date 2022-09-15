import { test, expect, describe, vi } from "vitest";
import { z } from "zod";
import { Wille } from "./wille";
import {
  createHandler,
  HandlerArg,
  resolveHandlerToProps,
  inferPropsBuilder,
} from "./handlerBuilder";

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
  // test("be able to add props builder", async () => {
  // const fn = vi.fn().mockImplementation(() => ({
  //   name: "hello",
  // }));
  // const handler = createHandler().propsResolver(fn);
  // const props = handler.propsBuilder({} as any);
  // expect(fn).toHaveBeenCalledTimes(1);
  // expect(props).toStrictEqual({ name: "hello" });
  // });
  test("session", () => {
    const sessionScheme = z.object({
      name: z.string(),
    });
    interface Env {
      MY_KV_NAMESPACE: KVNamespace;
    }
    const app = new Wille<typeof sessionScheme, Env>(
      {},
      { session: { scheme: sessionScheme, secret: "secret" } }
    );
    const handler = createHandler<typeof app>().addAction("foo", {
      resolve: async () => new Response("foo"),
    });

    expect(handler).toBeDefined();
  });
  test("extractProps", async () => {
    const action = vi.fn().mockImplementation(() => new Response("foo"));
    const handler = createHandler()
      .addAction("foo", {
        resolve: action,
      })
      .addPropsResolver(async (args) => {
        return {
          name: "hello",
        };
      });

    const handlerArgs: HandlerArg<{}> = {
      req: new Request("https://example.com"),
      env: {},
      ctx: {
        waitUntil: vi.fn(),
        passThroughOnException: vi.fn(),
      },
    };
    const props = await resolveHandlerToProps(handler, handlerArgs);
    expect(props.formProps("foo")).toStrictEqual({
      action: "###CURRENT_PAGE_URL###?action=foo",
      method: "POST",
    });
    expect(props.name).toBe("hello");
  });
});
