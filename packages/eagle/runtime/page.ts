import { Handler } from "./handler";

type Page<T = Record<string, any>> = (props: T) => JSX.Element;
export interface PageHandler<Session = unknown> {
  POST?: Handler<Session>;
}

export interface PageFile<
  Props = Record<string, any>,
  Session = unknown
> {
  default: Page<Props>;
  PageProps?: () => Props | undefined | null;
  handler?: PageHandler<Session>;
}
