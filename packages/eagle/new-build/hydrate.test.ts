import { join } from "path";
import { test, expect } from "vitest";
import { createHydratingTypeScriptStringOnPage } from "./hydrate";

test("rendering hydrate script as string", async () => {
  const pagePath = join("src", "pages", "index.tsx");
  const code = await createHydratingTypeScriptStringOnPage(pagePath);
  expect(code).toMatchInlineSnapshot(`
    "
    import { hydrate } from \\"react-dom\\"
    import Page from \\"../../src/pages/index\\"
    type PageProps = Record<string, any> | undefined | null

    function renderPage(props: PageProps) {
    // @ts-ignore
     return hydrate(<Page {...props} />, document.getElementById('eagle-root'))
    }

    // @ts-ignore
    let props: PageProps = {/** placeholder */}

    renderPage(props)
    "
  `);
});
