# Getting Started

<!-- <audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio> -->

<!-- ## Overview

Wille (German word for "will", pronounced `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button>, like "veet") is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts: -->

::: tip Compatibility Note
Wille requires [Node.js](https://nodejs.org/en/) version 18+, and requires [Wrangler2](https://github.com/cloudflare/wrangler2).
:::

<!-- With NPM:

```bash
$ npx wrangler init YOUR_FIRST_PROJECT_NAME
$ cd YOUR_FIRST_PROJECT_NAME
$ npm create wille@latest
```

With Yarn:

```bash
$ yarn create wille
``` -->

To bootstrap a new project:

```bash
npx wrangler init my-wille-app
cd my-wille-app
pnpm create wille my-wille-app
```

After the installation is complete:

- Run `pnpm dev` to start the development server on `http://localhost:8787`
- Visit `http://localhost:8787` to view your application
- Edit `pages/index.tsx` and see the updated result in your browser

A more in-depth Getting Started guide is available in the docs.
