#!/usr/bin/env node
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import * as path from "path";
import TOML from "@ltd/j-toml";
import { sync } from "cross-spawn";
import { writeRuntime } from "./generate";

const cwd = process.cwd();

async function mkdirIfNotExists(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir);
  }
}

export async function init() {
  // Create a pages directory
  const pageDirectory = path.join(cwd, "src", "pages");
  await mkdirIfNotExists(pageDirectory);

  // Create a sample page file
  const samplePageFile = `
export default function HelloWorld() {
return 'Hello World';
}
`;
  const samplePagePath = path.join(pageDirectory, "index.ts");
  if (!fs.existsSync(samplePagePath)) {
    fs.writeFileSync(samplePagePath, samplePageFile);
  }

  const wranglerPath = path.join(cwd, "wrangler.toml");
  const wrangler = fs.readFileSync(wranglerPath);
  const wranglerConfig = TOML.parse(wrangler);

  // Create a package.json file
  const packageJson = {
    name: wranglerConfig.name,
    version: "1.0.0",
    private: true,
    scripts: {
      start: "wrangler dev",
      build: "eagle build",
    },
  };
  const packageJsonPath = path.join(cwd, "package.json");
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // install dependencies
  const dependencies = [
    "react",
    "@vanilla-extract/css",
    "open-props",
    "react-dom",
    "zod",
  ];
  sync("pnpm", ["install", ...dependencies], {
    stdio: "inherit",
  });

  const devDependencies = [
    "@cloudflare/workers-types",
    "wrangler",
    "@toyamarinyon/eagle",
    "typescript",
    "types/react",
  ];
  sync("pnpm", ["install", "--save-dev", ...devDependencies], {
    stdio: "inherit",
  });

  // update wrangler.toml
  fs.writeFileSync(
    wranglerPath,
    withEagleToml(
      wranglerConfig.name?.toString() ?? "",
      wranglerConfig.compatibility_date?.toString() ?? ""
    )
  );

  await writeRuntime({});

  console.log("Eagle init complete!");
  const hint = `
You can now start using Eagle in your code.

import { eagleHandler } from ".eagle";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return eagleHandler(request);
  },
};
`;
  console.log(hint);
}

function withEagleToml(name: string, compatibilityDate: string) {
  const toml = `
name = "${name}"
main = "dist/index.mjs"
compatibility_date = "${compatibilityDate}"

[build]
command = "pnpm install && pnpm build"
`;
  return toml;
}
