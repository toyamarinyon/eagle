#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import TOML from "@ltd/j-toml";
import { sync } from "cross-spawn";
import { writeRuntime } from "./generate";

const cwd = process.cwd();

export function init() {
  // Create a pages directory
  const pageDirectory = path.join(cwd, "src", "pages");
  if (!fs.existsSync(pageDirectory)) {
    fs.mkdirSync(pageDirectory);
  }

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
  const devDependencies = ["@cloudflare/workers-types", "wrangler", "@toyamarinyon/eagle"];
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

  writeRuntime({});

  console.log("Eagle init complete!");
  const hint = `
You can now start using Eagle in your code.

import { eagleHandler } from ".eagle";

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
