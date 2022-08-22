import { join } from "path";
import { test, expect } from "vitest";
import { buildPageHydrationCode } from "./hydrate";

test("rendering hydrate script as string", async () => {
  const stubDir =  join(__dirname, "../__tests__", "stub");
  const pagePath = join("src", "pages", "index.tsx");
  const tmpRuntimeDir = join(stubDir, "node_modules", "runtime");
  const code = await buildPageHydrationCode(pagePath, tmpRuntimeDir);
  expect(code).toMatchSnapshot()

});
