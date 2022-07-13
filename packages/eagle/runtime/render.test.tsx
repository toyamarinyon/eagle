import { expect, test } from "vitest";
import { Page } from "./page";
import { render } from "./render";

test("render react component", async () => {
  const page: Page = {
    default: async () => <div>Hello</div>,
  };
  expect(await render(page)).toMatchInlineSnapshot('"<html lang=\\"en\\"><head><meta charSet=\\"UTF-8\\"/><meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge\\"/><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><title>Document</title></head><body><div>Hello</div></body></html>"');
});
