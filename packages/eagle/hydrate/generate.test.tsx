import { join } from "path";
import { test, expect } from "vitest";
import { getPageFileList } from "../router/router";
import { createHydrateRouter, renderString } from "./generate";

test("rendering hydrate script as string", async () => {
  const stubDir = join(__dirname, "__stub__");
  const pagePath = join("src", "pages", "index.tsx");
  const tmpRuntimeDir = join(stubDir, "node_modules", "runtime");
  const code = await renderString(tmpRuntimeDir, pagePath);
  expect(code).toMatchInlineSnapshot(`
    "// hydrate/__stub__/node_modules/runtime/reactShim.ts
    import * as React from \\"https://cdn.skypack.dev/react\\";

    // hydrate/__stub__/node_modules/runtime/tmp/src-pages-index.tsx
    import { hydrate } from \\"https://cdn.skypack.dev/react-dom\\";

    // hydrate/__stub__/src/pages/index.tsx
    function HelloWorld() {
      return /* @__PURE__ */ React.createElement(\\"div\\", null, \\"hello\\");
    }

    // hydrate/__stub__/node_modules/runtime/tmp/src-pages-index.tsx
    function renderPage(props2) {
      return hydrate(/* @__PURE__ */ React.createElement(HelloWorld, {
        ...props2
      }), document.getElementById(\\"eagle-root\\"));
    }
    var props = {};
    renderPage(props);
    "
  `);
});

test("create hydrate script router", async () => {
  const stubDir = join(__dirname, "__stub__");
  const tmpRuntimeDir = join(stubDir, "node_modules","runtime");
  const filePaths = getPageFileList("src/pages", [], stubDir);
  expect(filePaths).toMatchInlineSnapshot(`
    [
      "src/pages/directory/hello.tsx",
      "src/pages/index.tsx",
    ]
  `);
  const router = await createHydrateRouter(tmpRuntimeDir, filePaths);
  expect(router).toMatchSnapshot();
});
