import { expect, test } from "vitest";
import { createRouter, getPageFileList } from "./router";
import { join } from "path";

test("get file list", () => {
  const fileList = getPageFileList(
    "src/pages",
    [],
    join(__dirname, "__stub__")
  );
  expect(fileList).toMatchInlineSnapshot(`
    [
      "src/pages/directory/hello.ts",
      "src/pages/index.ts",
    ]
  `);
});

test("file list to router", () => {
  const fileList = ["src/pages/directory/hello.ts", "src/pages/index.ts"];
  const router = createRouter(fileList);
  expect(router).toMatchInlineSnapshot(`
    "
    export const routes = {
      [\\"directory/hello\\"]: async () => await import(\\"../../src/pages/directory/hello\\"),
      [\\"index\\"]: async () => await import(\\"../../src/pages/index\\"),
    }
      "
  `);
});
