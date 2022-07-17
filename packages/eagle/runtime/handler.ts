import { render, renderStream } from "./render";
import { HydrateRoutes, NotFoundError, router, Routes } from "./router";

export async function handler(
  request: Request,
  routes: Routes,
  hydrateRoutes: HydrateRoutes
) {
  try {
    const { page, hydrateScript } = await router(
      request,
      routes,
      hydrateRoutes
    );
    const result = render(page, hydrateScript);
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
