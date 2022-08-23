import { join } from "path";
import { test, expect } from "vitest";
import { buildPageHydrationCode } from "./hydrate";

test.skip("rendering hydrate script as string", async () => {
  const stubDir = join(__dirname, "../__tests__", "stub", "dist");
  const pagePath = join("src", "pages", "index.tsx");
  const code = await buildPageHydrationCode(pagePath, stubDir);
  expect(code).not.toBeUndefined();
});
