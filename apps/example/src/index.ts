import { eagle } from "$eagle";
import { z } from "zod";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const sessionScheme = z.object({
  userId: z.string(),
});
export const app = eagle({
  session: {
    scheme: sessionScheme,
    secret: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
  },
});

// Sample middleware
app.addMiddleware({
  onRequest: async (request) => {
    console.log(`request: ${request.url}`);
  },
});

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return app.handleRequest(request, env, ctx);
  },
};
