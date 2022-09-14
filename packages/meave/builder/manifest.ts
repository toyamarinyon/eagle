import TOML from "@ltd/j-toml";
import { createHash } from "crypto";
import { readdirSync, statSync } from "fs";
import { writeFileSync } from "fs";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import { z } from "zod";

export function getPageFilePaths(pagesDir: string, subDir = "") {
  const workingDir = process.cwd();
  const files = readdirSync(join(workingDir, pagesDir, subDir));

  let pageFilePaths: string[] = [];
  files.forEach(function (file) {
    const filePath = join(pagesDir, subDir, file);
    if (statSync(filePath).isDirectory()) {
      pageFilePaths.push(...getPageFilePaths(pagesDir, file));
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

export function createPageManifest(pagesDir: string, outputDir: string) {
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

export async function createAssetManifest(
  assetsDir: string,
  outputDir: string
) {
  const workingDir = process.cwd();
  const files = await readdir(join(workingDir, assetsDir));
  const filePathAndHashCollection = await Promise.all(
    files.map(async (file) => {
      const filePath = join(assetsDir, file);
      const fileBuffer = await readFile(filePath);
      const hashSum = createHash("sha256");
      hashSum.update(fileBuffer);
      const hex = hashSum.digest("hex");
      return { filePath, hash: hex };
    })
  );
  const manifest = TOML.stringify(
    {
      title: "eagle asset build manifest",
      assets: filePathAndHashCollection.map(({ filePath, hash }) =>
        TOML.Section({
          path: filePath,
          hash,
        })
      ),
    },
    {
      newline: "\r\n",
    }
  );
  const manifestPath = join(outputDir, "asset-manifest.toml");
  writeFileSync(manifestPath, manifest);
  return TOML.parse(manifest);
}
