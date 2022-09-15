import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { createWebCryptSession, WebCryptSession } from "webcrypt-session";
import { AnyZodObject } from "zod";
import { compose } from "./compose";
import { handler } from "./handler";
import { inferAnyZodObject } from "./inferAnyZodObject";
import { Middleware } from "./middleware";
import { Routes } from "./router";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";

export interface WilleOption<T = AnyZodObject> {
  session: {
    scheme: T;
    secret: string;
  };
}

export type inferWilleSession<T> = T extends Wille<
  inferAnyZodObject<infer SessionScheme>
>
  ? SessionScheme
  : never;

export class Wille<Session = any, Env = any> {
  private routes: Routes<Session>;
  private middlewareList: Middleware[] = [];

  webCryptSession?: WebCryptSession<inferAnyZodObject<Session>>;

  constructor(
    routes: Routes,
    option?: WilleOption<inferAnyZodObject<Session>>
  ) {
    this.routes = routes;
    if (option?.session != null) {
      this.setupSession(option.session);
    }
  }

  addMiddleware(middleware: Middleware) {
    this.middlewareList.push(middleware);
  }
  async handleRequest<Env extends Record<string, any>>(
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
      // return response;
      const text = await response.text();
      const replacedText = text.replace(
        "###CURRENT_PAGE_URL###",
        "${new URL(location.href).pathname}"
      );
      return new Response(replacedText, response);
    } catch (e) {
      const composed = compose(this.middlewareList);
      return await composed(request, async (request: Request) => {
        return await handler(
          request,
          env,
          ctx,
          this.routes,
          this.webCryptSession
        );
      });
    }
  }

  setupSession(
    sessionOption: WilleOption<inferAnyZodObject<Session>>["session"]
  ) {
    this.addMiddleware({
      onRequest: async (request) => {
        this.webCryptSession = await createWebCryptSession(
          sessionOption.scheme,
          request,
          {
            password: sessionOption.secret,
          }
        );
      },
      onResponse: async (response) => {
        const { headers } = response;
        headers.append(
          "set-cookie",
          this.webCryptSession?.toHeaderValue() || ""
        );
      },
    });
  }
}
