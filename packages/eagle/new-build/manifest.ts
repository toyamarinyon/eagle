import TOML from "@ltd/j-toml";
import { readdirSync, statSync } from "fs";
import { writeFileSync } from "fs";
import { join } from "path";
import { z } from "zod";

export function getPageFilePaths(pagesDir: string, subDir = "") {
  const workingDir = process.cwd();
  const files = readdirSync(join(workingDir, pagesDir, subDir));

  let pageFilePaths: string[] = [];
  files.forEach(function (file) {
    const filePath = join(pagesDir, subDir, file);
    if (statSync(filePath).isDirectory()) {
      console.log(file);
      pageFilePaths = getPageFilePaths(pagesDir, file);
    } else {
      pageFilePaths.push(join(subDir, file));
    }
  });

  return pageFilePaths;
}

const manifestScheme = z.object({
  title: z.string(),
  pages: z
    .object({
      path: z.string(),
    })
    .array(),
});

export function createManifest(pagesDir: string, outputDir: string) {
  const files = getPageFilePaths(pagesDir);
  const manifest = TOML.stringify(
    {
      title: "eagle build manifest",
      pages: files.map((file) =>
        TOML.Section({
          path: file,
        })
      ),
    },
    {
      newline: "\r\n",
    }
  );
  const manifestPath = join(outputDir, "manifest.toml");
  writeFileSync(manifestPath, manifest);
  return manifestScheme.parse(TOML.parse(manifest));
}
