import { build, transform } from "esbuild";
import { writeFileSync, rmSync } from "fs";
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

/**
 * Build hydrate code for the given page.
 * @param pagePath - path to the page to hydrate
 * @param distDir
 * @returns
 */
export async function buildPageHydrationCode(
  pagePath: string,
  distDir: string
) {
  const hydratePageString = createHydratingTypeScriptStringOnPage(pagePath);
  const flatPagePath = pagePath.replace(/\//g, "-");
  const hydrateTypeScriptPath = join(distDir, "tmp", flatPagePath);

  writeFileSync(hydrateTypeScriptPath, hydratePageString);
  await build({
    entryPoints: [hydrateTypeScriptPath],
    jsx: "automatic",
    bundle: true,
    format: "iife",
    loader: { ".ts": "tsx" },
    target: "es2022",
    outfile: join(distDir, flatPagePath),
  });
  rmSync(hydrateTypeScriptPath);
}

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
