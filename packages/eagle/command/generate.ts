import { join } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { createRouter, getPageFileList } from "../router/router";

type GenerateOption = {
  pagesDir: string;
  packageDir: string;
  runtimeDir: string;
};
export function generateRuntime({ pagesDir, packageDir }: GenerateOption) {
  const runtime = `
  import { handler, Page } from "${join(packageDir, "runtime")}";
  ${generateRouter(pagesDir)}
  export async function eagleHandler(request: Request) {
    return await handler(request, routes);
  }
  `;
  return runtime;
}
function generateRouter(pagesDir: string) {
  const files = getPageFileList(pagesDir);
  const router = createRouter(files);
  return router;
}

export function writeRuntime({
  pagesDir = "src/pages",
  packageDir = "@toyamarinyon/eagle",
  runtimeDir = "node_modules/.eagle",
}: Partial<GenerateOption>) {
  const runtime = generateRuntime({ pagesDir, packageDir, runtimeDir });
  if (!existsSync(runtimeDir)) {
    mkdirSync(runtimeDir);
  }
  writeFileSync(join(runtimeDir, "index.ts"), runtime);
}
