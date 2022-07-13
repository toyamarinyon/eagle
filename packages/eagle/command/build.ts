import { build } from "esbuild";
import { join } from "path";
import { writeRuntime, writeShim } from "./generate";

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
  writeRuntime({ pagesDir, packageDir, runtimeDir });
  writeShim({ runtimeDir });
  await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    bundle: true,
    minify: true,
    inject: [join(runtimeDir, "reactShim.ts")],
    loader: { ".js": "jsx" },
    outfile: "dist/index.mjs",
  });
}
