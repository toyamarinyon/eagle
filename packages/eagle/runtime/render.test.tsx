import { expect, test } from "vitest";
import { PageFile } from "./page";
import { render } from "./render";

test("render react component", async () => {
  const page: PageFile = {
    default: () => <div>Hello</div>,
  };
  expect(
    render(page, { props: {}, hydrateScript: "function hydrate() {}" })
  ).toMatchInlineSnapshot(
    `
    "<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div id=\\"eagle-root\\"><div>Hello</div></div>
    <script type=\\"module\\">
    function hydrate() {}
    </script></body></html>"
  `
  );
});

test("render with prepare props", async () => {
  const pageProps = () => ({
    message: "hello world",
  });
  const page: PageFile<{ message: string }> = {
    default: (props) => <div>{props?.message}</div>,
    PageProps: pageProps,
  };
  expect(render(page, { props: { message: 'hello world'}, hydrateScript: "function hydrate() {}" }))
    .toMatchInlineSnapshot(`
    "<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div id=\\"eagle-root\\"><div>hello world</div></div>
    <script type=\\"module\\">
    function hydrate() {}
    </script></body></html>"
  `);
});
