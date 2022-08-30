#!/usr/bin/env node
import { program } from "commander";
import { watch } from "chokidar";
import { buildEagle } from "./builder";
import concurrently from "concurrently";

program.name("eagle cli").description("CLI for Eagle").version("1.0.0");

program
  .command("build")
  .description("Build Eagle")
  .action(async () => {
    await buildEagle();
  });

program
  .command("dev-server")
  .description("Run Eagle in dev mode")
  .action(async () => {
    await buildEagle();
    watch("./src", {
      persistent: true,
    }).on("change", async (_event) => {
      console.log(`> Found a change. Rebuild assets.`);
      await buildEagle();
      console.log(`> Rebuild complete.`);
    });
  });

program
  .command("dev")
  .description("start development")
  .action(() => {
    const { result } = concurrently(
      [
        {
          command: "wrangler dev",
          name: "worker",
        },
        {
          command: "eagle dev-server",
          name: "dev-server",
        },
      ],
      {
        prefix: "name",
        killOthers: ["failure"],
        restartTries: 0,
      }
    );
    result.then(
      () => {},
      (error: any) => {
        // console.error(error);
      }
    );
  });

program.parse();
