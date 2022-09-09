import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject, z } from "zod";
import type { Meave } from "./meave";
import { inferAnyZodObject } from "./inferAnyZodObject";

interface ResolveArg<Env, Session, Input> {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
  session: WebCryptSession<inferAnyZodObject<Session>>;
  input: Input extends AnyZodObject ? z.infer<Input> : unknown;
}

interface HandlerArg<Env, Session> {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
  session: WebCryptSession<inferAnyZodObject<Session>>;
}

interface ActionHandler<Env, Session, Input> {
  input?: Input;
  resolve: (arg: ResolveArg<Env, Session, Input>) => Promise<Response>;
}
type PropsBuilderArg<Env, Session> = HandlerArg<Env, Session>;
export type ActionHandlers<Env = any, Session = any> = Record<
  string,
  ActionHandler<Env, Session, AnyZodObject | {}>
>;
type PropsBuilder<Env, Session> = (
  arg: PropsBuilderArg<Env, Session>
) => Promise<Record<string, any>>;

type GuardArg<Env, Session> = HandlerArg<Env, Session>;
export type Guard<Env, Session> = (
  arg: GuardArg<Env, Session>
) => Promise<Response | void>;

export class PageHandler<
  TActionHandlers extends ActionHandlers,
  TSession = any,
  TEnv = any
> {
  readonly actionHandlers: TActionHandlers;
  readonly propsBuilder: PropsBuilder<TEnv, TSession>;
  readonly guards: Guard<TEnv, TSession>[];
  constructor(
    actionHandlers: TActionHandlers,
    propsBuilder: PropsBuilder<TEnv, TSession>,
    guard: Guard<TEnv, TSession>[]
  ) {
    this.actionHandlers = actionHandlers;
    this.propsBuilder = propsBuilder;
    this.guards = guard;
  }

  addAction<TKey extends string, TScheme>(
    key: TKey,
    handler: ActionHandler<TEnv, TSession, TScheme>
  ) {
    return new PageHandler<
      TActionHandlers & Record<TKey, ActionHandler<TEnv, TSession, TScheme>>,
      TSession,
      TEnv
    >(
      {
        ...this.actionHandlers,
        [key]: handler,
      },
      this.propsBuilder,
      this.guards
    );
  }

  addPropsBuilder(propsBuilder: PropsBuilder<TEnv, TSession>) {
    return new PageHandler<TActionHandlers, TSession, TEnv>(
      {
        ...this.actionHandlers,
      },
      propsBuilder,
      this.guards
    );
  }

  addGuard(guard: Guard<TEnv, TSession>) {
    return new PageHandler<TActionHandlers, TSession, TEnv>(
      {
        ...this.actionHandlers,
      },
      this.propsBuilder,
      [...this.guards, guard]
    );
  }
}

type inferSession<TApp> = TApp extends Meave<infer TSession> ? TSession : never;
type inferEnv<TApp> = TApp extends Meave<any, infer TEnv> ? TEnv : never;

export function createHandler<TApp>() {
  return new PageHandler<{}, inferSession<TApp>, inferEnv<TApp>>(
    {},
    () => Promise.resolve({}),
    []
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
