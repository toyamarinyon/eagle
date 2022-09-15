import { createHandler } from "wille/handler";
import { app } from "..";

export const handler = createHandler<typeof app>().addDirectAction({
  resolve: async () => {
    /** @todo: implements session.destroy */
    return new Response(null, {
      status: 303,
      headers: {
        location: '/login',
        "Set-Cookie": "session=delete; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    });
  },
});

export default handler
