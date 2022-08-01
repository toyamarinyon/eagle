import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject } from "zod";
import { Handler } from "./handler";

type Page<T = Record<string, any>> = (props: T) => JSX.Element;
export interface PageHandler<Session = unknown> {
  POST?: Handler<Session>;
}

type inferPagePropsContext<SessionScheme = unknown> =
  SessionScheme extends AnyZodObject
    ? {
        req: Request;
        session: WebCryptSession<SessionScheme>;
      }
    : {
        req: Request;
      };

export type PageProps<Session = unknown, Props = Record<string, any>> = (
  args: inferPagePropsContext<Session>
) => Promise<Props | undefined | null>;

export interface PageFile<Props = Record<string, any>, Session = unknown> {
  default: Page<Props>;
  pageProps?: PageProps<Session, Props>;
  handler?: PageHandler<Session>;
}
