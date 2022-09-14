import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject, z } from "zod";
import { inferAnyZodObject } from "./inferAnyZodObject";

type inferHandlerArgs<SessionScheme = unknown> =
  SessionScheme extends AnyZodObject
    ? {
        req: Request;
        session: WebCryptSession<SessionScheme>;
      }
    : {
        req: Request;
      };

type ActionHandler<SessionScheme = unknown> = {
  processor: (args: inferHandlerArgs<SessionScheme>) => Promise<Response>;
};
type Actions = Record<string, ActionHandler>;

const zAny = z.any();
type AnySession = z.infer<typeof zAny>;

export class PageAction<
  TActions extends Actions,
  TSession = unknown,
  Env extends Record<string, any> = {}
> {
  readonly actions: TActions;
  constructor(actions: TActions) {
    this.actions = actions;
  }
  addAction<TPath extends string>(
    path: TPath,
    handler: ActionHandler<TSession>
  ) {
    return new PageAction<
      TActions & Record<TPath, ActionHandler>,
      TSession,
      Env
    >({
      ...this.actions,
      [path]: handler,
    });
  }

  async exec(
    path: string,
    req: Request,
    env: Env,
    ctx: ExecutionContext,
    webCryptSession?:
      | WebCryptSession<inferAnyZodObject<TSession>>
      | undefined
      | null
  ): Promise<Response> {
    const action = this.actions[path];
    if (action == null) {
      throw new Error("Missing action");
    }
    if (webCryptSession == null) {
      return await action.processor({ req });
    } else {
      return await (action as unknown as ActionHandler<AnySession>).processor({
        req,
        session: webCryptSession,
      });
    }
  }
}

export function createActions<SessionScheme = any>() {
  return new PageAction<{}, SessionScheme, {}>({});
}

type inferActions<T> = T extends PageAction<{}, unknown, {}>
  ? T["actions"]
  : never;
export function formProps<T>(name: keyof inferActions<T>) {
  return {
    // ###CURRENT_PAGE_URL### is replaced with the current page URL on the Edge
    action: `###CURRENT_PAGE_URL###?action=${String(name)}`,
    method: "POST",
  };
}
