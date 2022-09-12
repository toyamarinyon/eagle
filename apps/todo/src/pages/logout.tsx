import { createHandler } from "meave/handler";
import { z } from "zod";
import { app } from "..";

export const handler = createHandler<typeof app>().addAction("login", {
  input: z.object({
    username: z.string().min(1),
  }),
  resolve: async ({ session, input }) => {
    await session.save({
      username: input.username,
    });
    return new Response(null, {
      status: 303,
      headers: {
        location: "/",
      },
    });
  },
});
