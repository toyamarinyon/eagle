import { join, relative } from "path";
import { test, expect } from "vitest";
import { createHydratingTypeScriptStringOnPage } from "./hydrate";

test("rendering hydrate script as string", async () => {
  const pagePath = join("index.tsx");
  const code = await createHydratingTypeScriptStringOnPage(pagePath);
  expect(code).toMatchInlineSnapshot(`
    "
    import { hydrateRoot } from 'react-dom/client';
    import Page from \\"../../src/pages/index\\"
    type PageProps = Record<string, any> | undefined | null

    export function hydratePage(props: PageProps) {
      const container = document.getElementById('eagle-root')
      // @ts-ignore
      hydrateRoot(container, <Page {...props} />)
    }
    "
  `);
});
