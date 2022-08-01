import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject, z } from "zod";
import { inferAnyZodObject } from "./inferAnyZodObject";
import { render } from "./render";
import { HydrateRoutes, NotFoundError, router, Routes } from "./router";

export class MethodNotAllowedError extends Error {
  constructor(path: string, method: string) {
    super(`Method Not Allowed: path:${path}, method:${method}`);
  }
}

type inferHandlerArgs<SessionScheme = unknown> =
  SessionScheme extends AnyZodObject
    ? {
        req: Request;
        session: WebCryptSession<SessionScheme>;
      }
    : {
        req: Request;
      };

export type Handler<SessionScheme = unknown> = (
  args: inferHandlerArgs<SessionScheme>
) => Promise<Response>;

const zAny = z.any();
type AnySession = z.infer<typeof zAny>;

export async function handler<Session>(
  request: Request,
  routes: Routes,
  hydrateRoutes: HydrateRoutes,
  webCryptSession?:
    | WebCryptSession<inferAnyZodObject<Session>>
    | undefined
    | null
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
      if (webCryptSession != null) {
        return (page.handler.POST as Handler<AnySession>)({
          req: request,
          session: webCryptSession,
        });
      } else {
        return page.handler.POST({ req: request });
      }
      // Now, we can only handle GET and POST requests.
    } else if (request.method !== "GET") {
      const url = new URL(request.url);
      throw new MethodNotAllowedError(url.pathname, request.method);
    }
    const pagePropsArgs = { req: request, session: webCryptSession };
    const props = await page.pageProps?.(pagePropsArgs) ?? {};
    const result = render(page, { props, hydrateScript });
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
