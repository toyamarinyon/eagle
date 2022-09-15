interface MiddleWareBase {
  onRequest: (request: Request) => Promise<Request | void>;
  onResponse: (response: Response) => Promise<Response | void>;
}
export type Middleware = Partial<MiddleWareBase>;
