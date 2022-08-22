import { expect, test } from "vitest";
import { createManifest } from "./manifest";
import { join } from "path";

test("test", () => {
  const manifest = createManifest(
    "src/pages",
    join(__dirname, "../__tests__", "stub")
  );
  expect(manifest).toMatchInlineSnapshot(`
    [
      "",
      "title = 'eagle build manifest'",
      "",
      "[[pages]]",
      "",
      "path = 'src/pages/directory/hello.tsx'",
      "",
      "[[pages]]",
      "",
      "path = 'src/pages/index.tsx'",
      "",
    ]
  `);
});
