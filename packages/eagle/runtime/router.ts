import { PageFile } from "./page";

type Route<Props = Record<string, any>, Session = unknown> = () => Promise<
  PageFile<Props, Session>
>;
export type Routes<Session = unknown> = {
  [key: string]: Route<Record<string, any>, Session>;
};
export type HydrateRoutes = { [key: string]: string };

export class NotFoundError extends Error {
  constructor(path: string) {
    super(`Not found: ${path}`);
  }
}

export async function router<T = unknown>(
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
