import { expect, test } from "vitest";
import { createManifest } from "./manifest";
import { join } from "path";

test("test", () => {
  const manifest = createManifest(
    join("./__tests__", "stub", "src/pages"),
    join("./__tests__", "stub", "dist")
  );
  expect(manifest).toMatchInlineSnapshot(`
    {
      "pages": [
        {
          "path": "directory/hello.tsx",
        },
        {
          "path": "index.tsx",
        },
      ],
      "title": "eagle build manifest",
    }
  `);
});
