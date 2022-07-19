import { PageFile } from "./page";

type Route = () => Promise<PageFile>;
export type Routes = { [key: string]: Route };
export type HydrateRoutes = { [key: string]: string };

export class NotFoundError extends Error {
  constructor(path: string) {
    super(`Not found: ${path}`);
  }
}

export async function router(
  request: Request,
  routes: Routes,
  hydrateRoutes: HydrateRoutes
) {
  const url = new URL(request.url);
  const pathname = pathnameToFilePath(url.pathname);
  if (routes[pathname] == undefined) {
    throw new NotFoundError(pathname);
  }
  const pageFile = routes[pathname];
  const page = await pageFile();
  const hydrateScript = hydrateRoutes[pathname];
  return { page, hydrateScript };
}

export function pathnameToFilePath(pathname: string): string {
  const filePath = pathname
    .replace(/^\/$/, "index")
    .replace(/\/$/, "/index")
    .replace(/^\//, "");
  return filePath;
}
