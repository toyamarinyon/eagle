import { build } from "esbuild";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/esbuild-plugin";
import { createHandlerTypeScriptStringOnPage } from "./handler";
import { createHydratingTypeScriptStringOnPage } from "./hydrate";
import { createAssetManifest, createPageManifest } from "./manifest";

/**
 * Options for the build command.
 * @param pagesDir - path to the page files directory
 * @param packageDir - path to the package directory
 * @param runtimeDir - path to the runtime directory
 */
interface BuildOption {
  pagesDir: string;
  distDir: string;
  runtimeDir: string;
  isDev: boolean;
}
const defaultBuildOption: BuildOption = {
  pagesDir: "src/pages",
  distDir: "dist",
  runtimeDir: "node_modules/$eagle",
  isDev: true,
};

async function mkdirIfNotExists(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir);
  }
}

export async function buildEagle(option?: Partial<BuildOption>) {
  const buildOption = { ...defaultBuildOption, ...option };

  // Create directory for the build and runtime
  await mkdirIfNotExists(buildOption.distDir);
  await mkdirIfNotExists(join(buildOption.distDir, "tmp"));
  await mkdirIfNotExists(buildOption.runtimeDir);

  // Create build manifest
  const manifest = createPageManifest(
    buildOption.pagesDir,
    buildOption.distDir
  );

  // Create hydrate code for each page.
  const assetDir = join(buildOption.distDir, "public", "assets");
  Promise.all(
    manifest.pages.map(async (page) => {
      const hydratingTypeScriptString = createHydratingTypeScriptStringOnPage(
        page.path
      );
      const hydratingTypeScriptFilePath = join(
        buildOption.distDir,
        "tmp",
        page.path.replace(/\//g, "-")
      );
      await writeFile(hydratingTypeScriptFilePath, hydratingTypeScriptString);

      await build({
        entryPoints: [hydratingTypeScriptFilePath],
        jsx: "automatic",
        bundle: true,
        minify: !buildOption.isDev,
        format: "esm",
        loader: { ".ts": "tsx" },
        target: "es2022",
        plugins: [vanillaExtractPlugin()],
        define: {
          ["process.env.NODE_ENV"]: buildOption.isDev
            ? "development"
            : "production",
        },
        outdir: join(buildOption.distDir, "public", "assets"),
      });
    })
  );
  // Create asset manifest
  await createAssetManifest(assetDir, buildOption.distDir);

  // Create the handler from the pages
  const handlers = manifest.pages.map((page) => {
    return createHandlerTypeScriptStringOnPage(page.path);
  });
  const runtime = `
  import { handler, PageFile, Eagle, EagleOption, inferAnyZodObject } from "@toyamarinyon/eagle";

  const handlers = {
    ${handlers.join("\n")}
  }

  export function eagle<T = unknown>(option?: EagleOption<inferAnyZodObject<T>>) {
    return new Eagle(handlers, option);
  }
  `;

  await writeFile(join(buildOption.runtimeDir, "index.ts"), runtime);
  await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    target: "es2022",
    bundle: !buildOption.isDev,
    minify: true,
    loader: { ".ts": "tsx", ".js": "jsx" },
    footer: {
      js: `/** build at: ${Date.now()} */`,
    },
    jsx: "automatic",
    define: {
      ["process.env.NODE_ENV"]: buildOption.isDev
        ? "development"
        : "production",
    },
    outfile: "dist/index.mjs",
    plugins: [vanillaExtractPlugin({ outputCss: false })],
    external: ["__STATIC_CONTENT_MANIFEST"],
  });
}
