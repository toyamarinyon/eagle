#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import TOML from "@ltd/j-toml";
import { sync } from "cross-spawn";
import { copy, remove } from "fs-extra";

const cwd = process.cwd();

async function main() {
  // Prase wrangler.toml
  const wranglerPath = join(cwd, "wrangler.toml");
  const wranglerFile = await readFile(wranglerPath);
  const wranglerConfig = TOML.parse(wranglerFile);

  // Update wrangler.toml
  wranglerConfig.main = "dist/index.mjs";
  wranglerConfig.compatibility_flags = ["streams_enable_constructors"];
  wranglerConfig.site = TOML.Section({
    bucket: "./dist/public",
  });

  await writeFile(
    wranglerPath,
    TOML.stringify(wranglerConfig as unknown as any, { newline: "\n" })
  );

  // Create package.json file
  const packageJson = {
    name: wranglerConfig.name,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "wille dev",
      build: "wille build",
    },
  };
  const packageJsonPath = join(cwd, "package.json");
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // install dependencies
  const dependencies = [
    "react",
    "react-dom",
    "wille",
    "zod",
    "@vanilla-extract/css",
    "@vanilla-extract/recipes",
    "open-props",
  ];
  sync("pnpm", ["add", ...dependencies], {
    stdio: "inherit",
  });

  const devDependencies = [
    "@cloudflare/workers-types",
    "wrangler",
    "@types/react",
    "@types/react-dom",
  ];
  sync("pnpm", ["add", "--save-dev", ...devDependencies], {
    stdio: "inherit",
  });

  await copy(join(__dirname, "../", "templates"), join(cwd, "src"));

  // Build runtime
  sync("pnpm", ["build"], {
    stdio: "inherit",
  });

  // Remove package-lock.json that created by wrangler
  await remove(join(cwd, "package-lock.json"));
}

main()
  .then(() => {
    console.info("Done!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
