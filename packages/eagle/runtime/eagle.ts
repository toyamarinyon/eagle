import { createWebCryptSession, WebCryptSession } from "webcrypt-session";
import { AnyZodObject } from "zod";
import { compose } from "./compose";
import { handler } from "./handler";
import { inferAnyZodObject } from "./inferAnyZodObject";
import { Middleware } from "./middleware";
import { HydrateRoutes, Routes } from "./router";

export interface EagleOption<T = AnyZodObject> {
  session: {
    scheme: T;
    secret: string;
  };
}

export type inferEagleSession<T> = T extends Eagle<
  inferAnyZodObject<infer SessionScheme>
>
  ? SessionScheme
  : never;

export class Eagle<Session = unknown> {
  private routes: Routes<Session>;
  private middlewareList: Middleware[] = [];

  webCryptSession?: WebCryptSession<inferAnyZodObject<Session>>;

  constructor(
    routes: Routes,
    option?: EagleOption<inferAnyZodObject<Session>>
  ) {
    this.routes = routes;
    if (option?.session != null) {
      this.setupSession(option.session);
    }
  }

  addMiddleware(middleware: Middleware) {
    this.middlewareList.push(middleware);
  }
  async handleRequest(request: Request) {
    const composed = compose(this.middlewareList);
    return await composed(request, async (request: Request) => {
      return await handler(request, this.routes, this.webCryptSession);
    });
  }

  setupSession(
    sessionOption: EagleOption<inferAnyZodObject<Session>>["session"]
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
