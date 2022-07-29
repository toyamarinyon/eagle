import type { inferEagleSession, PageHandler } from "@toyamarinyon/eagle";
import { app } from "../index";

export const handler: PageHandler<inferEagleSession<typeof app>> = {
  POST: async ({ req, session }) => {
    console.log(
      session.userId
    )
    await session.save({
      userId: '4',
    });
    return new Response(null, {
      status: 303,
      headers: {
        location: "/",
      },
    });
  },
};
export default function SignIn() {
  return (
    <form action="" method="post">
      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" />
      <button type="submit">Submit</button>
    </form>
  );
}
