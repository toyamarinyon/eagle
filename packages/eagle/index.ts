#!/usr/bin/env node
import { program } from "commander";
import { init, buildEagle } from "./command";

program.name("eagle cli").description("CLI for Eagle").version("1.0.0");
program
  .command("init")
  .description("Initialize Eagle")
  .action(() => {
    init();
  });

program
  .command("build")
  .description("Build Eagle")
  .action(async () => {
    await buildEagle({});
  });

program.parse();
