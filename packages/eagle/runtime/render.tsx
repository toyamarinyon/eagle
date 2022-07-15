import { Page } from "./page";
import { renderToReadableStream, renderToString } from "react-dom/server";

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div id="eagle-root">{children}</div>
        {"{{SCRIPT_PLACEHOLDER}}"}
      </body>
    </html>
  );
}

export async function renderStream(page: Page) {
  let controller = new AbortController();
  let didError = false;
  try {
    const pageElement = page.default();
    let stream = await renderToReadableStream(
      <Document>{pageElement}</Document>,
      {
        signal: controller.signal,
        onError(error) {
          didError = true;
          console.error(error);
        },
      }
    );

    // This is to wait for all Suspense boundaries to be ready. You can uncomment
    // this line if you want to buffer the entire HTML instead of streaming it.
    // You can use this for crawlers or static generation:

    // await stream.allReady;
    return stream;
    // return new Response(stream, {
    //   status: didError ? 500 : 200,
    //   headers: { "Content-Type": "text/html" },
    // });
  } catch (error) {
    throw error;
  }
}

export function render(page: Page) {
  const Component = page.default;
  const html = (
    <Document>
      <Component />
    </Document>
  );
  const renderResult = renderToString(html);
  const clientCode = renderResult.replace(
    "{{SCRIPT_PLACEHOLDER}}",
    `
<script type="module">
// node_modules/.eagle/reactShim.ts
import * as React from "https://cdn.skypack.dev/react";

// node_modules/.eagle/client.tsx
import { hydrate } from "https://cdn.skypack.dev/react-dom";

// src/pages/index.tsx
import { useState } from "https://cdn.skypack.dev/react";
function AnotherComponent() {
  return /* @__PURE__ */ React.createElement("h1", null, "Hello!");
}
function HelloWorld(props2) {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(AnotherComponent, null), props2.message, "! Satoshi!", /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      console.log("hello");
      setCount(count + 1);
    }
  }, "click"), /* @__PURE__ */ React.createElement("p", null, "count: ", count));
}

// node_modules/.eagle/client.tsx
function renderPage(props2) {
  return hydrate(/* @__PURE__ */ React.createElement(HelloWorld, {
    ...props2
  }), document.getElementById("eagle-root"));
}
var props = { message: '--------------' };
renderPage(props);

</script>`
  );
  return clientCode;
}
