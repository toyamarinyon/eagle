import { test, expect } from "vitest";
import { createHandlerTypeScriptStringOnPage } from "./handler";

test("createHandlerTypeScriptStringOnPage", () => {
  expect(
    createHandlerTypeScriptStringOnPage("index.tsx")
  ).toMatchInlineSnapshot('"[\\"index\\"]: async () => await import(\\"../../src/pages/index\\") as unknown as PageFile,"');

  expect(
    createHandlerTypeScriptStringOnPage("hello.tsx")
  ).toMatchInlineSnapshot('"[\\"hello\\"]: async () => await import(\\"../../src/pages/hello\\") as unknown as PageFile,"');

  expect(
    createHandlerTypeScriptStringOnPage("posts/index.tsx")
  ).toMatchInlineSnapshot('"[\\"posts/index\\"]: async () => await import(\\"../../src/pages/posts/index\\") as unknown as PageFile,"');

});
