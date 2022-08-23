import { readdirSync, statSync } from "fs";
import { join, extname, basename, dirname } from "path";

const handlerTemplate = `["{key}"]: async () => await import("{path}") as unknown as PageFile,`;

export function createHandlerTypeScriptStringOnPage(pagePath: string) {
  const ext = extname(pagePath);
  const base = basename(pagePath, ext);
  const dir = dirname(pagePath);
  const subdir = dir.replace(/^src\/pages\/?/, "");
  const handlerTypescriptString = handlerTemplate
    .replace("{key}", join(subdir, base))
    .replace("{path}", join("../../", dir, base));
  return handlerTypescriptString;
}
