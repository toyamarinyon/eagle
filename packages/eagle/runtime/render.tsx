import { PageFile } from "./page";
import { renderToReadableStream, renderToString } from "react-dom/server";
import { pathnameToFilePath } from "./router";

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
  const html = (
    <Document>
      <Component {...options.props} />
    </Document>
  );
  const renderResult = renderToString(html);
  const clientCode = renderResult.replace(
    "{{SCRIPT_PLACEHOLDER}}",
    `
<style>${css}</style>
<script type="module">
  import { hydratePage } from "/assets/${pathnameToFilePath(url.pathname)}.js"
  hydratePage(${JSON.stringify(options.props)});
</script>`
  );
  return clientCode;
}
