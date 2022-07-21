import { join } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { createRouter, getPageFileList } from "../router/router";
import { createHydrateRouter } from "../hydrate/generate";

type GenerateOption = {
  pagesDir: string;
  packageDir: string;
  runtimeDir: string;
};
export async function generateRuntime({
  pagesDir,
  packageDir,
  runtimeDir,
}: GenerateOption) {
  const router = await generateRouter(pagesDir, runtimeDir);
  const runtime = `
  import { handler, PageFile, createEagle } from "${join(packageDir)}";
  ${router}

  export function eagle() {
    return createEagle(routes, hydrateRoutes)
  }
  export async function eagleHandler(request: Request) {
    return await handler(request, routes, hydrateRoutes);
  }
  `;
  return runtime;
}
async function generateRouter(pagesDir: string, runtimeDir: string) {
  const files = getPageFileList(pagesDir);
  const hydrateRouter = await createHydrateRouter(runtimeDir, files);
  const router = `${createRouter(files)}${hydrateRouter}`;
  return router;
}

export async function writeRuntime({
  pagesDir = "src/pages",
  packageDir = "@toyamarinyon/eagle",
  runtimeDir = "node_modules/.eagle",
}: Partial<GenerateOption>) {
  if (!existsSync(runtimeDir)) {
    mkdirSync(runtimeDir);
  }
  const runtimeTmpDirectory = join(runtimeDir, "tmp");
  if (!existsSync(runtimeTmpDirectory)) {
    mkdirSync(runtimeTmpDirectory);
  }
  writeShim({ packageDir });
  const runtime = await generateRuntime({ pagesDir, packageDir, runtimeDir });
  writeFileSync(join(runtimeDir, "index.ts"), runtime);
}

export function writeShim({
  runtimeDir = "node_modules/.eagle",
}: Partial<GenerateOption>) {
  const shim = `
import * as React from "react";
export { React };`;

  writeFileSync(join(runtimeDir, "reactShim.ts"), shim);
}
