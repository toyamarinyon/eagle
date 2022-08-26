#!/usr/bin/env node
import { program } from "commander";
import { buildEagle } from "./builder";

program.name("eagle cli").description("CLI for Eagle").version("1.0.0");

program
  .command("build")
  .description("Build Eagle")
  .action(async () => {
    await buildEagle();
  });

program.parse();
