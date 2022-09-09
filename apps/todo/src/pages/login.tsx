import { createHandler, formProps } from "meave/handler";
import { z } from "zod";
import { app } from "..";
import { Button } from "../components/button";
import { TextField } from "../components/form/field";
import { Layout } from "../components/layout";
import { Heading } from "../components/typography";
import { sprinkles } from "../styles/sprinkles.css";

export const pageProps = async () => {
  return {
    message: "Hello World",
  };
};

const formScheme = z.object({
  username: z.string().min(1),
});

export const handler = createHandler<typeof app>().addAction("login", {
  input: z.object({
    username: z.string().min(1),
  }),
  resolve: async ({ req, session, input }) => {
    try {
      await session.save({
        username: input.username,
      });
      return new Response(null, {
        status: 303,
        headers: {
          location: "/",
        },
      });
    } catch (e) {
      console.log(e);
      return new Response(null, {
        status: 303,
        headers: {
          location: "/signIn",
        },
      });
    }
  },
});

export const Page = (
  props: Awaited<ReturnType<typeof pageProps>>
): JSX.Element => {
  return (
    <Layout>
      <Heading
        className={sprinkles({
          marginBottom: 6,
        })}
      >
        Todo on Edge
      </Heading>
      <form {...formProps<typeof handler>("login")}>
        <TextField label="Username" name="username" />
        <Button type="submit" fullWidth>
          Login
        </Button>
      </form>
    </Layout>
  );
};

export default Page;
