import { render } from "./render";
import { router, Routes } from "./router";

export async function handler(request: Request, routes: Routes) {
  const page = await router(request, routes);
  const result = await render(page);
  return new Response(result);
}
