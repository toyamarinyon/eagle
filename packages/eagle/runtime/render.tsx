import { Page } from "./page";
import { renderToReadableStream, renderToString } from "react-dom/server";
import * as React from "react";

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

export async function renderStream(page: Page) {
  let controller = new AbortController();
  let didError = false;
  try {
    const pageElement = await page.default();
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

export async function render(page: Page) {
  const pageElement = await page.default();
  const string = renderToString(<Document>{pageElement}</Document>);
  return string;
}
