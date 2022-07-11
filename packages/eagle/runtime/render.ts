import { Page } from "./page";

export async function render(page: Page) {
  return page.default();
}
