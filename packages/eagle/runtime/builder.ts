import { createWebCryptSession, WebCryptSession } from "webcrypt-session";
import { AnyZodObject, z } from "zod";
import { compose } from "./compose";
import { handler } from "./handler";
import { Middleware } from "./middleware";
import { HydrateRoutes, Routes } from "./router";

const middlewareList: Middleware[] = [];
interface EagleOption<T = AnyZodObject> {
  session: {
    scheme: T;
    secret: string;
  };
}

type EagleSession<T> = T extends AnyZodObject
  ? z.infer<EagleOption<T>["session"]["scheme"]>
  : never;

type inferAnyZodObject<T> = T extends AnyZodObject ? T : never;

export class Eagle<T> {
  private routes: Routes;
  private hydrateRoutes: HydrateRoutes;
  private middlewareList: Middleware[] = [];

  session?: EagleSession<T>;
  webCryptSession?: WebCryptSession<inferAnyZodObject<T>>;

  constructor(
    routes: Routes,
    hydrateRoutes: HydrateRoutes,
    option?: EagleOption<inferAnyZodObject<T>>
  ) {
    this.routes = routes;
    this.hydrateRoutes = hydrateRoutes;
    if (option?.session != null) {
      this.setupSession(option.session);
    }
  }

  addMiddleware(middleware: Middleware) {
    this.middlewareList.push(middleware);
  }
  async handleRequest(request: Request) {
    const composed = compose(middlewareList);
    return await composed(
      request,
      async (request) => await handler(request, this.routes, this.hydrateRoutes)
    );
  }

  injectSession() {
    if (this.webCryptSession == null) {
      throw new Error();
    }
    const { toHeaderValue, ...session } = this.webCryptSession;
    return session;
  }

  getSession(): EagleSession<T> {
    return this.session as EagleSession<T>;
  }

  setupSession(sessionOption: EagleOption<inferAnyZodObject<T>>["session"]) {
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

export function createEagle<T>(
  routes: Routes,
  hydrateRoutes: HydrateRoutes,
  option?: EagleOption<inferAnyZodObject<T>>
) {
  return new Eagle(routes, hydrateRoutes, option);
}
