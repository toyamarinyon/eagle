const { build } = require("esbuild");
const { join } = require("path");
const path = require("path");
const pkg = require(path.resolve("./package.json"));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const base = {
  sourcemap: true,
  platform: "node",
  bundle: true,
  format: "cjs",
  minify: true,
  external,
};

// build cli
build({
  ...base,
  entryPoints: [join("eagle.ts")],
  outfile: join("dist", "eagle.js"),
  sourcemap: true,
  platform: "node",
  bundle: true,
  format: "cjs",
  external,
});

// build lib
build({
  ...base,
  entryPoints: [join('runtime', "index.ts")],
  outfile: join("dist", "index.js"),
  sourcemap: true,
  platform: "node",
  bundle: true,
  format: "esm",
  external,
});
