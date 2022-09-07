import { WebCryptSession } from "webcrypt-session";
import { z } from "zod";
import type { Eagle } from "./eagle";
import { inferAnyZodObject } from "./inferAnyZodObject";

interface ResolveArg<Env, Session> {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
  session: WebCryptSession<inferAnyZodObject<Session>>;
}
interface ActionHandler<Env, Session> {
  input?: z.ZodTypeAny;
  resolve: (arg: ResolveArg<Env, Session>) => Promise<Response>;
}
export type ActionHandlers<Env = any, Session = any> = Record<
  string,
  ActionHandler<Env, Session>
>;
type PropsBuilder = () => Promise<Record<string, any>>;

export class PageHandler<
  TActionHandlers extends ActionHandlers,
  TSession = any,
  TEnv = any
> {
  readonly actionHandlers: TActionHandlers;
  readonly propsBuilder: PropsBuilder;
  constructor(actionHandlers: TActionHandlers, propsBuilder: PropsBuilder) {
    this.actionHandlers = actionHandlers;
    this.propsBuilder = propsBuilder;
  }

  addAction<TKey extends string>(
    key: TKey,
    handler: ActionHandler<TEnv, TSession>
  ) {
    return new PageHandler<
      TActionHandlers & Record<TKey, ActionHandler<TEnv, TSession>>,
      TSession,
      TEnv
    >(
      {
        ...this.actionHandlers,
        [key]: handler,
      },
      this.propsBuilder
    );
  }

  addPropsBuilder(propsBuilder: PropsBuilder) {
    return new PageHandler<TActionHandlers, TSession, TEnv>(
      {
        ...this.actionHandlers,
      },
      propsBuilder
    );
  }
}

type inferSession<TApp> = TApp extends Eagle<infer TSession> ? TSession : never;
type inferEnv<TApp> = TApp extends Eagle<any, infer TEnv> ? TEnv : never;

export function createHandler<TApp>() {
  return new PageHandler<{}, inferSession<TApp>, inferEnv<TApp>>({}, () =>
    Promise.resolve({})
  );
}

type inferActions<TPageHandlers> = TPageHandlers extends PageHandler<{}, {}, {}>
  ? TPageHandlers["actionHandlers"]
  : never;
export function formProps<TPageHandlers>(
  name: keyof inferActions<TPageHandlers>
) {
  return {
    // ###CURRENT_PAGE_URL### is replaced with the current page URL on the Edge
    action: `###CURRENT_PAGE_URL###?action=${String(name)}`,
    method: "POST",
  };
}
