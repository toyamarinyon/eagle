import { PageFile } from "./page";
import { renderToReadableStream, renderToString } from "react-dom/server";
import { pathnameToFilePath } from "./handler";

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
        <div id="meave-root">{children}</div>
        {"{{SCRIPT_PLACEHOLDER}}"}
      </body>
    </html>
  );
}

// export async function renderStream(page: PageFile) {
//   let controller = new AbortController();
//   let didError = false;
//   try {
//     const pageElement = page.default();
//     let stream = await renderToReadableStream(
//       <Document>{pageElement}</Document>,
//       {
//         signal: controller.signal,
//         onError(error) {
//           didError = true;
//           console.error(error);
//         },
//       }
//     );

//     // This is to wait for all Suspense boundaries to be ready. You can uncomment
//     // this line if you want to buffer the entire HTML instead of streaming it.
//     // You can use this for crawlers or static generation:

//     // await stream.allReady;
//     return stream;
//     // return new Response(stream, {
//     //   status: didError ? 500 : 200,
//     //   headers: { "Content-Type": "text/html" },
//     // });
//   } catch (error) {
//     throw error;
//   }
// }

interface RenderOption<Props> {
  props: Props;
}

export async function render<Props extends Record<string, any>>(
  page: PageFile<Props>,
  request: Request,
  css: string,
  options: RenderOption<Props>
) {
  const url = new URL(request.url);
  const Component = page.default;
  /** @todo remove this hack */
  // @ts-ignore
  const isDev = process.env.NODE_ENV === "development";
  const reloadScript = isDev
    ? `
  const ws = new WebSocket('ws://localhost:30111');
  ws.addEventListener("message", async (event) => {
    location.reload();
  });
  `
    : "";
  const html = (
    <Document>
      <Component {...options.props} />
    </Document>
  );
  const renderResult = renderToString(html);
  const clientCode = renderResult
    .replace(
      "{{SCRIPT_PLACEHOLDER}}",
      `
<style>
${css}
</style>
<script type="module">
  import { hydratePage } from "/assets/${pathnameToFilePath(url.pathname)}.js"
  const props = ${JSON.stringify(options.props)}
  props.formProps = (name) => {
    return {
      action: \`###CURRENT_PAGE_URL###?action=\${String(name)}\`,
      method: "POST",
    };
  },
  hydratePage(props);

  ${reloadScript}
</script>`
    )
    .replace(/###CURRENT_PAGE_URL###/g, url.pathname);
  return clientCode;
}
