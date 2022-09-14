import { WebCryptSession } from "webcrypt-session";
import { AnyZodObject, z } from "zod";
import type { Meave } from "./meave";

/////////////////
/////////////////
/// Type Util ///
/////////////////
/////////////////

/**
 * Every handler runs with the following arguments
 */
export type HandlerArg<Env> = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
};

/**
 * If session is enabled, session is passed to the handler
 */
type SessionHandlerArg<Session extends AnyZodObject> = {
  session: WebCryptSession<Session>;
};
type WeekSessionHandlerArg = {
  session: any;
};

/**
 * If input is defined, action handler receives input
 */
type ActionResolverArg<Input> = {
  input: Input extends AnyZodObject ? z.infer<Input> : unknown;
};
type WeekActionResolverArg = {
  input: any;
};

/**
 * Inference of the handler arguments
 */
export type inferHandlerArg<Env, Session> = Session extends AnyZodObject
  ? HandlerArg<Env> & SessionHandlerArg<Session>
  : WeekHandlerArg<Env>;
type WeekHandlerArg<Env> = HandlerArg<Env> & WeekSessionHandlerArg;

/**
 * Inference of the action resolver arguments
 */
type inferActionResolverArg<Env, Session, Input> = Session extends AnyZodObject
  ? HandlerArg<Env> & SessionHandlerArg<Session> & ActionResolverArg<Input>
  : HandlerArg<Env> & ActionResolverArg<Input>;
type WeekActionHandlerArg<Env> = HandlerArg<Env> &
  WeekSessionHandlerArg &
  WeekActionResolverArg;

///////////////////////
///////////////////////
/// Type Definition ///
///////////////////////
///////////////////////

/**
 * Type of action handler
 */
interface ActionHandler<Env, Session, Input> {
  input?: Input;
  resolve: (
    arg: inferActionResolverArg<Env, Session, Input>
  ) => Promise<Response>;
}
export interface WeekActionHandler<Env> {
  input?: any;
  resolve: (arg: WeekActionHandlerArg<Env>) => Promise<Response>;
}

/**
 * Collection of action handlers
 */
export type ActionHandlers<Env = any, Session = any> = Record<
  string,
  ActionHandler<Env, Session, AnyZodObject | {}>
>;

/**
 * Type of props resolver
 */
export type PropsResolver<Env, Session> = (
  arg: inferHandlerArg<Env, Session>
) => Promise<Record<string, any>>;

export type WeekPropsResolver<Env> = (
  arg: WeekHandlerArg<Env>
) => Promise<Record<string, any>>;

/**
 * Type of request guards
 */
export type Guard<Env, Session> = (
  arg: inferHandlerArg<Env, Session>
) => Promise<Response | void>;
export type WeekGuard<Env> = (
  arg: WeekHandlerArg<Env>
) => Promise<Response | void>;

/////////////////////////
/////////////////////////
///  Class Definition ///
/////////////////////////
/////////////////////////

export class PageHandler<
  TActionHandlers extends ActionHandlers,
  TPropsResolver extends PropsResolver<TEnv, TSession>,
  TSession = any,
  TEnv = any
> {
  readonly actionHandlers: TActionHandlers;
  readonly propsResolver: TPropsResolver;
  readonly guards: Guard<TEnv, TSession>[];
  constructor(
    actionHandlers: TActionHandlers,
    propsResolver: TPropsResolver,
    guard: Guard<TEnv, TSession>[]
  ) {
    this.actionHandlers = actionHandlers;
    this.propsResolver = propsResolver;
    this.guards = guard;
  }

  addAction<TKey extends string, TScheme>(
    key: TKey,
    handler: ActionHandler<TEnv, TSession, TScheme>
  ) {
    return new PageHandler<
      TActionHandlers & Record<TKey, ActionHandler<TEnv, TSession, TScheme>>,
      TPropsResolver,
      TSession,
      TEnv
    >(
      {
        ...this.actionHandlers,
        [key]: handler,
      },
      this.propsResolver,
      this.guards
    );
  }

  addDirectAction<TScheme>(handler: ActionHandler<TEnv, TSession, TScheme>) {
    return this.addAction("direct", handler);
  }
  hasDirectAction() {
    return this.actionHandlers["direct"] != null;
  }

  addPropsResolver<NewPropsResolver extends PropsResolver<TEnv, TSession>>(
    propsResolver: NewPropsResolver
  ) {
    return new PageHandler<TActionHandlers, NewPropsResolver, TSession, TEnv>(
      {
        ...this.actionHandlers,
      },
      propsResolver,
      this.guards
    );
  }

  addGuard(guard: Guard<TEnv, TSession>) {
    return new PageHandler<TActionHandlers, TPropsResolver, TSession, TEnv>(
      {
        ...this.actionHandlers,
      },
      this.propsResolver,
      [...this.guards, guard]
    );
  }
}

/////////////////////
/////////////////////
/// Class Utility ///
/////////////////////
/////////////////////

/**
 * Inference session type from the App instance
 */
type inferSession<TApp> = TApp extends Meave<infer TSession> ? TSession : {};

/**
 * Inference environment type from the App instance
 */
type inferEnv<TApp> = TApp extends Meave<any, infer TEnv> ? TEnv : {};

/**
 * Inference action type from the PageHandler instance
 */
type inferActions<TPageHandlers> = TPageHandlers extends PageHandler<
  {},
  any,
  {},
  {}
>
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

/**
 * Inference session type from the PageHandler instance
 */
type inferHandlerSession<THandler> = THandler extends PageHandler<
  any,
  any,
  infer TSession extends AnyZodObject,
  any
>
  ? z.infer<TSession>
  : {};

/**
 * Helper of create page handler
 * @returns PageHandler
 */
export function createHandler<TApp>() {
  return new PageHandler<
    {},
    PropsResolver<inferEnv<TApp>, inferSession<TApp>>,
    inferSession<TApp>,
    inferEnv<TApp>
  >(
    {},
    async () => {
      return {};
    },
    []
  );
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/// Page handler runtime resolve Utility ///
/////////////////////////////////////////////
/////////////////////////////////////////////

/**
 * Inference return type of PropsBuilder from the PageHandler instance
 */
export type inferPropsBuilder<THandler> = THandler extends PageHandler<
  any,
  infer TPropsBuilder extends PropsResolver<any, any>,
  any,
  any
>
  ? Awaited<ReturnType<TPropsBuilder>>
  : {};

/**
 * Type of resolver
 */
type HandlerGeneratedProps<TPageHandler extends PageHandler<any, any, any>> = {
  formProps: (key: keyof inferActions<TPageHandler>) => Record<string, string>;
  session: inferHandlerSession<TPageHandler>;
} & {
  [K in keyof inferPropsBuilder<TPageHandler>]: string;
};
export type inferProps<THandler> = THandler extends PageHandler<any, any, any>
  ? HandlerGeneratedProps<THandler>
  : never;

export async function resolveHandlerToProps<
  TPageHandler extends PageHandler<any, any, any, any>
>(
  handler: TPageHandler,
  args: WeekHandlerArg<{}>
): Promise<HandlerGeneratedProps<TPageHandler>> {
  const props = await handler.propsResolver(args);

  const returnProps: HandlerGeneratedProps<TPageHandler> = {
    ...props,
    formProps: (name: keyof inferActions<typeof handler>) => {
      return {
        // Note: ###CURRENT_PAGE_URL### is replaced with the current page URL on the Edge
        action: `###CURRENT_PAGE_URL###?action=${String(name)}`,
        method: "POST",
      };
    },
    session: {} as inferHandlerSession<typeof handler>,
  };
  return returnProps;
}
