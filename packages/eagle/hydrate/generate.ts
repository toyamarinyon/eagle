import { build } from "esbuild";
import { writeFileSync, rmSync } from "fs";
import { basename, dirname, extname, join } from "path";

// @ts-ignore
import { skypackPlugin } from "../build/skypackPlugin.js";

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

export async function renderString(runtimeDir: string, path: string) {
  const ext = extname(path);
  const base = basename(path, ext);
  const dir = dirname(path);
  const tsCode = hydrateCodeTemplate.replace(
    "{path}",
    join("../../../", join(dir, base))
  );
  const tmpPath = join(runtimeDir, "tmp", path.replace(/\//g, "-"));
  writeFileSync(tmpPath, tsCode);
  const buildResult = await build({
    entryPoints: [tmpPath],
    inject: [join(runtimeDir, "reactShim.ts")],
    target: "es2022",
    format: "esm",
    bundle: true,
    plugins: [skypackPlugin],
    write: false,
  });
  rmSync(tmpPath);

  return buildResult.outputFiles[0].text;
}

export async function createHydrateRouter(
  runtimeDir: string,
  filePaths: string[]
) {
  const tmp = await Promise.all(
    filePaths.map(async (filePath) => {
      const hydrateString = await renderString(runtimeDir, filePath);
      const ext = extname(filePath);
      const base = basename(filePath, ext);
      const dir = dirname(filePath);
      const subdir = dir.replace(/^src\/pages\/?/, "");
      return [join(subdir, base), hydrateString];
    })
  );
  return `
  export const hydrateRoutes = {
  ${tmp
    .map(([filePath, hydrateString]) => `["${filePath}"]: \`${hydrateString}\``)
    .join(",\n  ")}
  }`;
}
