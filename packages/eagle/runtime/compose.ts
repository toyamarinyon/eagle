import { Handler } from "./handler";

interface MiddleWareBase {
  onRequest: (request: Request) => Promise<Request | void>;
  onResponse: (response: Response) => Promise<Response | void>;
}
export type Middleware = Partial<MiddleWareBase>;
export const eagleCompose = (middlewareCollection: Middleware[]) => {
  return async (req: Request, handler: Handler) => {
    const onRequestMiddleware = middlewareCollection.filter(
      (middleware): middleware is Pick<MiddleWareBase, "onRequest"> =>
        middleware.onRequest != null
    );

    let request = req;
    for await (const middleware of onRequestMiddleware) {
      request = (await middleware.onRequest(request)) || request;
    }
    let response = await handler(request);

    const onResponseMiddleware = middlewareCollection.filter(
      (middleware): middleware is Pick<MiddleWareBase, "onResponse"> =>
        middleware.onResponse != null
    );

    for await (const middleware of onResponseMiddleware) {
      response = (await middleware.onResponse(response)) || response;
    }
    return response;
  };
};
