import { render } from "./render";
import { NotFoundError, router, Routes } from "./router";

export async function handler(request: Request, routes: Routes) {
  try {
    const page = await router(request, routes);
    const result = await render(page);
    return new Response(result, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response("Not Found", {
        status: 404,
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }
  }
}
