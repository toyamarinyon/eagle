import { basename, dirname, extname, join } from "path";

const hydrateCodeTemplate = `
import { hydrate } from "react-dom"
import Page from "{path}"
type PageProps = Record<string, any> | undefined | null

function renderPage(props: PageProps) {
// @ts-ignore
 return hydrate(<Page {...props} />, document.getElementById('eagle-root'))
}

// @ts-ignore
let props: PageProps = {/** placeholder */}

renderPage(props)
`;

export function createHydratingTypeScriptStringOnPage(pagePath: string) {
  const ext = extname(pagePath);
  const base = basename(pagePath, ext);
  const dir = dirname(pagePath);
  const hydratePageString = hydrateCodeTemplate.replace(
    "{path}",
    join("../../", join(dir, base))
  );
  return hydratePageString;
}
