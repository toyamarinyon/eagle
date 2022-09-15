import { basename, dirname, extname, join } from "path";

const hydrateCodeTemplate = `
import { hydrateRoot } from 'react-dom/client';
import Page from "{path}"
type PageProps = Record<string, any> | undefined | null

export function hydratePage(props: PageProps) {
  const container = document.getElementById('wille-root')
  // @ts-ignore
  hydrateRoot(container, <Page {...props} />)
}
`;

export function createHydratingTypeScriptStringOnPage(pagePath: string) {
  const ext = extname(pagePath);
  const base = basename(pagePath, ext);
  const dir = dirname(pagePath);
  const hydratePageString = hydrateCodeTemplate.replace(
    "{path}",
    join("../../", "src", "pages", dir, base)
  );
  return hydratePageString;
}
