import { expect, test } from "vitest";
import { createAssetManifest, createPageManifest } from "./manifest";
import { join } from "path";

test("test", () => {
  const manifest = createPageManifest(
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

test("asset manifest", async () => {
  const manifest = await createAssetManifest(
    join("./__tests__", "stub", "dist", "assets"),
    join("./__tests__", "stub", "dist")
  );
  expect(manifest).toMatchInlineSnapshot(`
    {
      "assets": [
        {
          "hash": "409a7d990c245f2901327032704b256c2fe3d219f63896da6723a9b9849dd0bb",
          "path": "__tests__/stub/dist/assets/index.js",
        },
      ],
      "title": "eagle asset build manifest",
    }
  `);
});
