export interface Page {
  default: () => Promise<string>;
}
type Route = () => Promise<Page>;
type Routes = { [key: string]: Route };

export async function render(path: string, routes: Routes) {
  const pageFile = routes[path];
  if (pageFile == undefined) {
    throw new Error(`Page not found: ${path}`);
  }
  const page = await pageFile();
  return page.default();
}
export async function router(request: Request, routes: Routes) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/^\//, "");
  const result = await render(pathname, routes);
  return new Response(result);
}
