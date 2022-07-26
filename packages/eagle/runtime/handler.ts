import { createWebCryptSession, WebCryptSession } from "webcrypt-session";
import { z } from "zod";
import { inferAnyZodObject } from "./inferAnyZodObject";
import { render } from "./render";
import { HydrateRoutes, NotFoundError, router, Routes } from "./router";

export class MethodNotAllowedError extends Error {
  constructor(path: string, method: string) {
    super(`Method Not Allowed: path:${path}, method:${method}`);
  }
}
export type Handler<T> = (
  req: Request,
  getSession: GetSession<T>
) => Promise<Response>;

export type EagleHandler = (
  request: Request,
  routes: Routes,
  hydrateRoutes: HydrateRoutes
) => Promise<Response>;

export type EagleHandlerBuilder = (request: Request) => Promise<EagleHandler>;

export type GetSession<T> = () => Omit<
  WebCryptSession<inferAnyZodObject<T>>,
  "toHeaderValue"
>;

export async function handler<T>(
  request: Request,
  routes: Routes,
  hydrateRoutes: HydrateRoutes,
  getSession: GetSession<T>
) {
  try {
    const { page, hydrateScript } = await router(
      request,
      routes,
      hydrateRoutes
    );
    if (request.method === "POST") {
      if (page?.handler?.POST == null) {
        const url = new URL(request.url);
        throw new MethodNotAllowedError(url.pathname, request.method);
      }
      return page.handler.POST(request, getSession);
      // Now, we can only handle GET and POST requests.
    } else if (request.method !== "GET") {
      const url = new URL(request.url);
      throw new MethodNotAllowedError(url.pathname, request.method);
    }
    const props = page.PageProps?.() ?? {};
    const result = render(page, props, hydrateScript);
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
    } else if (error instanceof MethodNotAllowedError) {
      return new Response("Method Not Allowed", {
        status: 405,
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
