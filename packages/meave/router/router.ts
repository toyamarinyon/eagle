import { readdirSync, statSync } from "fs";
import { join, extname, basename, dirname } from "path";

export function getPageFileList(
  dirPath: string,
  arrayOfFiles: string[] = [],
  baseDir = process.cwd()
) {
  const readDirPath = join(baseDir, dirPath);
  const files = readdirSync(readDirPath);

  files.forEach(function (file) {
    const filePath = join(readDirPath, file);
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getPageFileList(
        join(dirPath, file),
        arrayOfFiles,
        baseDir
      );
    } else {
      arrayOfFiles.push(join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

const routeTemplate = `["{key}"]: async () => await import("{path}") as unknown as PageFile,`;

export function addRoute(filePath: string) {
  const ext = extname(filePath);
  const base = basename(filePath, ext);
  const dir = dirname(filePath);
  const subdir = dir.replace(/^src\/pages\/?/, "");
  const router = routeTemplate
    .replace("{key}", join(subdir, base))
    .replace("{path}", join("../../", dir, base));
  return router;
}

export function createRouter(filePaths: string[]) {
  return `
export const routes = {
  ${filePaths.map((filePath) => addRoute(filePath)).join("\n  ")}
}
  `;
}
