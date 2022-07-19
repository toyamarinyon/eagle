export const skypackPlugin = {
  name: "skypackPlugin",
  setup(build) {
    // import React from skypack
    build.onResolve({ filter: /^react$/ }, (args) => ({
      path: "https://cdn.skypack.dev/react",
      external: true,
    }));

    // import ReactDom from skypack
    build.onResolve({ filter: /^react-dom$/ }, (args) => ({
      path: "https://cdn.skypack.dev/react-dom",
      external: true,
    }));
  },
};
