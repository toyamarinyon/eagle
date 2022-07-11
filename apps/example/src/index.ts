import { eagleHandler } from ".eagle";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return eagleHandler(request);
  },
};
