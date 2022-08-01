import type { inferEagleSession, PageHandler } from "@toyamarinyon/eagle";
import { z } from "zod";
import { app } from "../index";

const formScheme = z.object({
  email: z.string(),
  password: z.string(),
});

export const handler: PageHandler<inferEagleSession<typeof app>> = {
  POST: async ({ req, session }) => {
    const formData = await req.formData();
    const formObject = Object.fromEntries(formData.entries());
    try {
      const { email, password } = formScheme.parse(formObject);
      if (email === "toyamarinyon@gmail.com" && password === "secret") {
        await session.save({
          userId: "4",
        });
        return new Response(null, {
          status: 303,
          headers: {
            location: "/",
          },
        });
      }
      throw new Error();

    } catch(e) {
      console.log(e)
      return new Response(null, {
        status: 303,
        headers: {
          location: "/signIn",
        },
      });
    }
  },
};
export default function SignIn() {
  return (
    <form action="" method="post">
      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" />

      <button type="submit">Submit</button>
    </form>
  );
}
