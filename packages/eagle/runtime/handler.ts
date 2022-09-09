import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject, ZodObject } from "zod";
import { inferAnyZodObject } from "./inferAnyZodObject";
import { render } from "./render";
import { NotFoundError, router, Routes } from "./router";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { PageHandler, ActionHandlers, Guard } from "./handlerBuilder";

export class MethodNotAllowedError extends Error {
  constructor(path: string, method: string) {
    super(`Method Not Allowed: path:${path}, method:${method}`);
  }
}

export async function handler<Session, Env extends Record<string, any>>(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  routes: Routes,
  webCryptSession?:
    | WebCryptSession<inferAnyZodObject<Session>>
    | undefined
    | null
): Promise<Response> {
  try {
    const { page } = await router(request, routes);
    const url = new URL(request.url);
    const actionKey = url.searchParams.get("action");
    // If handler has guards, run them and exit process with returning response if any of them returns a response
    if (page.handler != null && page.handler.guards.length > 0) {
      for (const guard of page.handler.guards) {
        const result = await (guard as Guard<Env, Session>)({
          req: request,
          env,
          ctx,
          session: webCryptSession ?? ({} as WebCryptSession<AnyZodObject>),
        });
        if (result != null) {
          return result;
        }
      }
    }
    if (
      request.method === "POST" &&
      page.handler != null &&
      actionKey != null
    ) {
      const pageHandler = page.handler as PageHandler<
        ActionHandlers<Env, Session>,
        Session
      >;
      const actionHandler = pageHandler.actionHandlers[actionKey];
      if (actionHandler == null) {
        throw new Error("Missing action");
      }
      // If action handler has input scheme, validate input and exit process with returning
      // response if validation fails
      let input = {};
      if (actionHandler.input != null) {
        if (!(actionHandler.input instanceof ZodObject)) {
          throw new Error("Input must be a ZodObject");
        }
        if (request.headers.get("Content-Type") === "application/json") {
          try {
            input = actionHandler.input.parse(request.body);
          } catch (e) {
            return new Response(JSON.stringify(e), { status: 400 });
          }
        } else if (
          request.headers.get("Content-Type") ===
          "application/x-www-form-urlencoded"
        ) {
          const formData = await request.formData();
          const formObject = Object.fromEntries(formData.entries());
          try {
            input = actionHandler.input.parse(formObject);
          } catch (e) {
            return new Response(JSON.stringify(e), { status: 400 });
          }
        }
      }
      return await actionHandler.resolve({
        req: request,
        env,
        ctx,
        input,
        session: webCryptSession ?? ({} as WebCryptSession<AnyZodObject>),
      });
    } else if (request.method !== "GET") {
      const url = new URL(request.url);
      throw new MethodNotAllowedError(url.pathname, request.method);
    }
    const pagePropsArgs = { req: request, session: webCryptSession };
    const props = (await page.pageProps?.(pagePropsArgs)) ?? {};

    const css = await asset_from_kv(
      new Request(
        new URL(
          `/assets/${pathnameToFilePath(url.pathname)}.css`,
          url.origin
        ).toString()
      ),
      env,
      ctx
    );
    const result = await render(page, request, css, { props });
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

async function asset_from_kv<Env extends Record<string, any>>(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  try {
    const assetManifest = JSON.parse(manifestJSON);
    // Add logic to decide whether to serve an asset or run your original Worker code
    const response = await getAssetFromKV(
      {
        request,
        waitUntil: (promise) => {
          return ctx.waitUntil(promise);
        },
      },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: assetManifest,
      }
    );
    return await response.text();
  } catch (error) {
    return "";
  }
}

export function pathnameToFilePath(pathname: string): string {
  const filePath = pathname
    .replace(/^\/$/, "index")
    .replace(/\/$/, "/index")
    .replace(/^\//, "")
    .replace(/\//g, "-");
  return filePath;
}
