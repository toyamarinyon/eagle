import { Page } from "./page";

type Route = () => Promise<Page>;
export type Routes = { [key: string]: Route };

export async function router(request: Request, routes: Routes) {
  const url = new URL(request.url);
  const pathname = pathnameToFilePath(url.pathname);
  if (routes[pathname] == undefined) {
    throw new Error(`Page not found: ${pathname}`);
  }
  const pageFile = routes[pathname];
  const page = await pageFile();
  return page
}

export function pathnameToFilePath(pathname: string): string {
  const filePath = pathname
    .replace(/^\/$/, "index")
    .replace(/\/$/, "/index")
    .replace(/^\//, "");
  return filePath;
}
