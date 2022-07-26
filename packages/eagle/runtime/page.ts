import { Handler } from "./handler";

type Page<T = Record<string, any>> = (props: T) => JSX.Element;
export interface PageHandler {
  POST?: Handler;
}

export interface PageFile<T = Record<string, any>> {
  default: Page<T>;
  PageProps?: () => Record<string, any> | undefined | null;
  handler?: PageHandler;
}
