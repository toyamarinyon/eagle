import { renderStream } from "./render";
import { NotFoundError, router, Routes } from "./router";

export async function handler(request: Request, routes: Routes) {
  const page = await router(request, routes);

  try {
    const page = await router(request, routes);
    const result = await renderStream(page);
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
    } else {
      console.log(error);
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }
  }
}
