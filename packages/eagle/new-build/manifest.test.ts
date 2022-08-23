import { expect, test } from "vitest";
import { createManifest } from "./manifest";
import { join, relative } from "path";

test("test", () => {
  const manifest = createManifest(
    join("./__tests__", "stub", "src/pages"),
    join("./__tests__", "stub", "dist")
  );
  expect(manifest).toMatchInlineSnapshot(`
    {
      "pages": [
        {
          "path": "__tests__/stub/src/pages/directory/hello.tsx",
        },
        {
          "path": "__tests__/stub/src/pages/index.tsx",
        },
      ],
      "title": "eagle build manifest",
    }
  `);
});
