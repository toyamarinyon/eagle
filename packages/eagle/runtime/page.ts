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

export interface PageFile<Props = Record<string, any>, Session = unknown> {
  default: Page<Props>;
  PageProps?: (
    args: inferPagePropsContext<Session>
  ) => Promise<Props | undefined | null>;
  handler?: PageHandler<Session>;
}
