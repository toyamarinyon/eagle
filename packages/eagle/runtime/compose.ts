import { Handler } from "./handler";
import { Middleware } from "./middleware";

export const compose = (middlewareCollection: Middleware[]) => {
  return async (req: Request, handler: Handler) => {
    const onRequestMiddleware = middlewareCollection.filter(
      (middleware): middleware is Required<Pick<Middleware, "onRequest">> =>
        middleware.onRequest != null
    );

    let request = req;
    for await (const middleware of onRequestMiddleware) {
      request = (await middleware.onRequest(request)) || request;
    }
    let response = await handler(request);

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
