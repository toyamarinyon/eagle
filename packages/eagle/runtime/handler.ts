import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject, z } from "zod";
import { inferAnyZodObject } from "./inferAnyZodObject";
import { render } from "./render";
import { NotFoundError, pathnameToFilePath, router, Routes } from "./router";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { PageAction } from "./action";

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
    if (
      request.method === "POST" &&
      page.actions != null &&
      actionKey != null
    ) {
      return await (page.actions as PageAction<{}, Session>).exec(
        actionKey,
        request,
        env,
        ctx,
        webCryptSession
      );
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
