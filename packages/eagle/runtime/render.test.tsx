import { expect, test } from "vitest";
import { Page } from "./page";
import { render } from "./render";

test("render react component", async () => {
  const page: Page = {
    default: async () => <div>Hello</div>,
  };
  expect(await render(page)).toBe("<div>Hello</div>");
});
