import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject } from "zod";

type ActionMethod = "GET" | "POST" | "PUT" | "DELETE";

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
  method: ActionMethod;
};
type Actions = Record<string, ActionHandler>;
type ActionFormProps = {
  path: string;
  method: ActionMethod;
};
export class PageAction<TActions extends Actions, TSession = unknown> {
  readonly actions: TActions;
  constructor(actions: TActions) {
    this.actions = actions;
  }
  formProps(path: keyof TActions): ActionFormProps {
    const action = this.actions[path];
    return {
      path: String(path),
      method: action.method,
    };
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

type inferActions<T> = T extends PageAction<{}> ? T['actions']: never
export function formProps<T>(name: keyof inferActions<T>) {
  return {
    action: String(name),
  };
}
