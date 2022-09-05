import { z } from "zod";

interface ActionHandler {
  input?: z.ZodTypeAny;
  resolve: () => Promise<Response>;
}
type ActionHandlers = Record<string, ActionHandler>;
type PropsBuilder = () => Promise<Record<string, any>>;

class PageHandler<TActionHandlers extends ActionHandlers> {
  readonly actionHandlers: TActionHandlers;
  readonly propsBuilder: PropsBuilder;
  constructor(actionHandlers: TActionHandlers, propsBuilder: PropsBuilder) {
    this.actionHandlers = actionHandlers;
    this.propsBuilder = propsBuilder;
  }

  addAction<TKey extends string>(key: TKey, handler: ActionHandler) {
    return new PageHandler<TActionHandlers & Record<TKey, ActionHandler>>(
      {
        ...this.actionHandlers,
        [key]: handler,
      },
      this.propsBuilder
    );
  }

  addPropsBuilder(propsBuilder: PropsBuilder) {
    return new PageHandler<TActionHandlers>(
      {
        ...this.actionHandlers,
      },
      propsBuilder
    );
  }
}

export function pageHandler() {
  return new PageHandler({}, () => Promise.resolve({}));
}
