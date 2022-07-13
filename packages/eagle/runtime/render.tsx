import { Page } from "./page";
import { renderToString } from "react-dom/server";

export async function render(page: Page) {
  const string =  renderToString(await page.default());
  return string
  // let controller = new AbortController();
  // let didError = false;
  // try {
  //   let stream = await renderToReadableStream(await page.default(), {
  //     signal: controller.signal,
  //     onError(error) {
  //       didError = true;
  //       console.error(error);
  //     },
  //   });

  //   // This is to wait for all Suspense boundaries to be ready. You can uncomment
  //   // this line if you want to buffer the entire HTML instead of streaming it.
  //   // You can use this for crawlers or static generation:

  //   // await stream.allReady;

  //   return new Response('hello', {
  //     status: didError ? 500 : 200,
  //     headers: { "Content-Type": "text/html" },
  //   });
  // } catch (error) {
  //   console.log(error)
  //   return new Response(
  //     '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
  //     {
  //       status: 500,
  //       headers: { "Content-Type": "text/html" },
  //     }
  //   );
  // }
}
