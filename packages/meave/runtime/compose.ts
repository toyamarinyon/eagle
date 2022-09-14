import { Middleware } from "./middleware";

export type ComposeHandler = (req: Request) => Promise<Response>;
export const compose = (middlewareCollection: Middleware[]) => {
  return async (req: Request, handler: ComposeHandler) => {
    const onRequestMiddleware = middlewareCollection.filter(
      (middleware): middleware is Required<Pick<Middleware, "onRequest">> =>
        middleware.onRequest != null
    );

    let request = req;
    for await (const middleware of onRequestMiddleware) {
      request = (await middleware.onRequest(request)) || request;
    }
    let response = await handler(req);

    const onResponseMiddleware = middlewareCollection.filter(
      (middleware): middleware is Required<Pick<Middleware, "onResponse">> =>
        middleware.onResponse != null
    );

    for await (const middleware of onResponseMiddleware) {
      response = (await middleware.onResponse(response)) || response;
    }
    return response;
  };
};
