#!/usr/bin/env node
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import TOML from "@ltd/j-toml";
import { sync } from "cross-spawn";

const pageDir = "src/pages";

const samplePageFile = `
import { useState } from "react";

export const pageProps = async () => {
  return {
    message: "Hello World",
  };
};

export const Page = (
  props: Awaited<ReturnType<typeof pageProps>>
): JSX.Element => {
  const [count, setCount] = useState(0);
  return (
    <div>
      {props.message}! developer!
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        click
      </button>
      <p>count: {count}</p>
    </div>
  );
};

export default Page;

`;

const sampleEntryFile = `
import { eagle } from "$eagle";

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

export const app = eagle();

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return app.handleRequest(request, env, ctx);
  },
};

`;

async function mkdirIfNotExists(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir);
  }
}

const cwd = process.cwd();

async function main() {
  // Prase wrangler.toml
  const wranglerPath = join(cwd, "wrangler.toml");
  const wranglerFile = await readFile(wranglerPath);
  const wranglerConfig = TOML.parse(wranglerFile);

  // Update wrangler.toml
  wranglerConfig.main = "dist/index.mjs";
  wranglerConfig.compatibility_flags = ["streams_enable_constructors"];
  wranglerConfig.build = TOML.Section({
    command: "pnpm install && pnpm build",
  });
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
      start: "wrangler dev",
      build: "eagle new-build",
    },
  };
  const packageJsonPath = join(cwd, "package.json");
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // install dependencies
  const dependencies = [
    "react",
    "react-dom",
    "zod",
    "@vanilla-extract/css",
    "open-props",
  ];
  sync("pnpm", ["add", ...dependencies], {
    stdio: "inherit",
  });

  const devDependencies = [
    "@cloudflare/workers-types",
    "wrangler",
    "@toyamarinyon/eagle",
    "typescript",
    "@types/react",
  ];
  sync("pnpm", ["add", "--save-dev", ...devDependencies], {
    stdio: "inherit",
  });

  // Create page directory
  await mkdirIfNotExists(pageDir);

  // Create sample page
  await writeFile(`${pageDir}/index.tsx`, samplePageFile);

  // Create sample entry file
  await writeFile("index.ts", sampleEntryFile);

  // Build runtime
  sync("pnpm", ["build"], {
    stdio: "inherit",
  });
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
