import { build } from "esbuild";
import { writeRuntime } from "./generate";

interface BuildOption {
  pagesDir?: string;
  packageDir?: string;
  runtimeDir?: string;
}
export async function buildEagle({
  pagesDir = "src/pages",
  packageDir = "@eagle/eagle",
  runtimeDir = "node_modules/.eagle",
}: BuildOption) {
  writeRuntime({ pagesDir, packageDir, runtimeDir });
  await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    bundle: true,
    minify: true,
    outfile: "dist/index.mjs",
  });
}
