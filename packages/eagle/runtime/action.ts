import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject } from "zod";

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

export class PageAction<TActions extends Actions, TSession = unknown> {
  readonly actions: TActions;
  constructor(actions: TActions) {
    this.actions = actions;
  }
  addAction<TPath extends string>(
    path: TPath,
    handler: ActionHandler<TSession>
  ) {
    return new PageAction<TActions & Record<TPath, ActionHandler>>({
      ...this.actions,
      [path]: handler,
    });
  }
}

export function createActions<SessionScheme = unknown>() {
  return new PageAction<{}, SessionScheme>({});
}

type inferActions<T> = T extends PageAction<{}> ? T["actions"] : never;
export function formProps<T>(name: keyof inferActions<T>) {
  return {
    // ###CURRENT_PAGE_URL### is replaced with the current page URL on the Edge
    action: `###CURRENT_PAGE_URL###?action=${String(name)}`,
    method: "POST",
  };
}
