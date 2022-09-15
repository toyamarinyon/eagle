const { build } = require("esbuild");
const { join } = require("path");
const path = require("path");
const pkg = require(path.resolve("./package.json"));


const entryPoint = join("index.ts");
const outfile = join("dist", "index.js");
build({
  entryPoints: [entryPoint],
  outfile,
  sourcemap: true,
  platform: "node",
  bundle: true,
  format: "cjs",
});
