import type { PageHandler } from "@toyamarinyon/eagle";
import { app } from "..";

export const handler: PageHandler = {
  POST: async (_) => {
    const auth = getAuth(app)
    await signIn(auth)
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
