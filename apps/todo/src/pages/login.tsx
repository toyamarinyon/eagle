import { createHandler, inferProps } from "meave/handler";
import { z } from "zod";
import { app } from "..";
import { Button } from "../components/button";
import { TextField } from "../components/form/field";
import { Layout } from "../components/layout";
import { Heading } from "../components/typography";
import { sprinkles } from "../styles/sprinkles.css";

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

export const Page = ({
  formProps,
}: inferProps<typeof handler>): JSX.Element => {
  return (
    <Layout>
      <Heading
        className={sprinkles({
          marginBottom: 6,
        })}
      >
        Todo on Edge
      </Heading>
      <form {...formProps("login")}>
        <TextField label="Username" name="username" />
        <Button type="submit" fullWidth>
          Login
        </Button>
      </form>
    </Layout>
  );
};

export default Page;
