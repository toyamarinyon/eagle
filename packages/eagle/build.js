const { build } = require("esbuild");
const { join } = require("path");
const path = require("path");
const pkg = require(path.resolve("./package.json"));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const entryPoint = join("index.ts");
const outfile = join("dist", "index.js");
build({
  entryPoints: [entryPoint],
  outfile,
  sourcemap: true,
  platform: "node",
  bundle: true,
  format: "cjs",
  external,
});
