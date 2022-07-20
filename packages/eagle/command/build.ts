import { build } from "esbuild";
import { join } from "path";
import { writeRuntime } from "./generate";

// @ts-ignore
import { skypackPlugin } from "../build/skypackPlugin.js";

interface BuildOption {
  pagesDir?: string;
  packageDir?: string;
  runtimeDir?: string;
}
export async function buildEagle({
  pagesDir = "src/pages",
  packageDir = "@toyamarinyon/eagle",
  runtimeDir = "node_modules/.eagle",
}: BuildOption) {
  await writeRuntime({ pagesDir, packageDir, runtimeDir });
  await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    target: "es2022",
    bundle: true,
    minify: true,
    inject: [join(runtimeDir, "reactShim.ts")],
    outfile: "dist/index.mjs",
  });
}
