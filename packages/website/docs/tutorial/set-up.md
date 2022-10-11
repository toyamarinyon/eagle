# Set up
<!-- 
You don't need to write UI component for this tutorial, because there is prebuilt one.

Let's run the following commands:

```bash
# Clone the template
npx degit toyamarinyon/intro-wille task-page

cd task-page

pnpm install
```

Now we can quickly check that the various UI components for our task management webpage are working properly: -->

<!-- 
まずは、チュートリアル用のプロジェクトを作成しましょう。

を進めていくためのベースとなるコードを作ります。
WranglerとWilleの
 -->

::: tip Compatibility Note
Wille requires [Node.js](https://nodejs.org/en/) version 18+, and requires [Wrangler2](https://github.com/cloudflare/wrangler2).
:::

First, let’s do a project for this tutorial.

```bash
npx wrangler init wille-tutorial
cd wille-tutorial
pnpm create wille wille-tutorial
```

Now, we can run a development server using `pnpm dev` then you can see the following page on http://0.0.0.0:8787 :

![An image](./set-up-001.png)

Next, we will create a database for this tutorial.
