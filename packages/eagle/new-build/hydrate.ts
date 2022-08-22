import { build } from "esbuild";
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
 * @param runtimeDir
 * @returns
 */
export async function buildPageHydrationCode(
  pagePath: string,
  runtimeDir: string
) {
  const ext = extname(pagePath);
  const base = basename(pagePath, ext);
  const dir = dirname(pagePath);
  const tsCode = hydrateCodeTemplate.replace(
    "{path}",
    join("../../../", join(dir, base))
  );
  const tmpPath = join(runtimeDir, "tmp", pagePath.replace(/\//g, "-"));
  writeFileSync(tmpPath, tsCode);
  const buildResult = await build({
    entryPoints: [tmpPath],
    jsx: "automatic",
    bundle: true,
    format: "iife",
    loader: { ".ts": "tsx" },
    target: "es2022",
    write: false,
  });
  rmSync(tmpPath);

  return buildResult.outputFiles[0].text;
}
