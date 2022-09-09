const { build } = require("esbuild");
const { join } = require("path");
const path = require("path");
const pkg = require(path.resolve("./package.json"));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  "__STATIC_CONTENT_MANIFEST",
];

const base = {
  sourcemap: true,
  platform: "node",
  bundle: true,
  format: "cjs",
  minify: false,
  external,
};

// build cli
build({
  ...base,
  entryPoints: [join("meave.ts")],
  outfile: join("dist", "meave.js"),
  sourcemap: true,
  platform: "node",
  bundle: true,
  format: "cjs",
  external,
});

// build lib
build({
  // ...base,
  entryPoints: [
    join("runtime", "index.ts"),
    join("runtime", "handlerBuilder.ts"),
  ],
  outdir: "dist",
  platform: "node",
  bundle: true,
  loader: { ".ts": "tsx" },
  jsx: "automatic",
  format: "esm",
  external,
});
