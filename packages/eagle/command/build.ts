import { build } from "esbuild";
import { join } from "path";
import { writeRuntime, writeShim } from "./generate";

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
  writeRuntime({ pagesDir, packageDir, runtimeDir });
  writeShim({ runtimeDir });
  await build({
    entryPoints: [join(runtimeDir, "client.tsx")],
    outfile: "dist/client.js",
    inject: [join(runtimeDir, "reactShim.ts")],
    target: "es2022",
    format: "esm",
    bundle: true,
    plugins: [skypackPlugin],
    external: ["react", "react-dom"],
  });
  await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    bundle: true,
    minify: process.env.NODE_ENV === "production",
    inject: [join(runtimeDir, "reactShim.ts")],
    loader: { ".js": "jsx" },
    outfile: "dist/index.mjs",
  });
}
