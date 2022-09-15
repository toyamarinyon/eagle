#!/usr/bin/env node
import { program } from "commander";
import { watch } from "chokidar";
import { buildWille } from "./builder";
import concurrently from "concurrently";
import { Writable } from "node:stream";
import { stdout } from "node:process";
import {
  sendMessageToBrowser,
  startWebSocketServer,
} from "./dev-websocket/server";

program.name("wille cli").description("CLI for Wille").version("1.0.0");

program
  .command("build")
  .description("Build Maeve")
  .action(async () => {
    await buildWille({ isDev: false });
  });

program
  .command("dev-server")
  .description("Run Wille in dev mode")
  .action(async () => {
    await buildWille();
    watch("./src", {
      persistent: true,
    }).on("change", async (_event) => {
      console.log(`> Found a change. Rebuild assets.`);
      await buildWille();
      console.log(`> Rebuild complete.`);
    });
  });

program
  .command("dev")
  .description("start development")
  .action(() => {
    const ws = startWebSocketServer();
    const outputStream = new Writable({
      write: (chunk, encoding, next) => {
        stdout.write(chunk);
        if (chunk.toString().includes("Done syncing assets")) {
          sendMessageToBrowser();
        }
        next();
      },
    });
    const { result } = concurrently(
      [
        {
          command: "wrangler dev",
          name: "worker",
        },
        {
          command: "wille dev-server",
          name: "dev-server",
        },
      ],
      {
        prefix: "name",
        killOthers: ["failure"],
        restartTries: 0,
        outputStream: outputStream,
      }
    );
    result
      .then(
        () => {},
        (error: any) => {
          // console.error(error);
        }
      )
      .finally(() => {
        ws.close();
      });
  });

program.parse();
