import { getPageFileList } from "../router/router";
import TOML from "@ltd/j-toml";

export function createManifest(pagesDir: string, baseDir = process.cwd()) {
  const files = getPageFileList(pagesDir, [], baseDir);
  return TOML.stringify({
    title: "eagle build manifest",
    pages: files.map((file) =>
      TOML.Section({
        path: file,
      })
    ),
  });
}
