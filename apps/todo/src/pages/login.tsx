import { createHandler, formProps } from "@toyamarinyon/eagle/handler";
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
  resolve: async ({ req, session }) => {
    const formData = await req.formData();
    const formObject = Object.fromEntries(formData.entries());
    try {
      const { username } = formScheme.parse(formObject);
      await session.save({
        username,
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
      <form {...formProps<typeof handlers>("login")}>
        <TextField label="Username" name="username" />
        <Button type="submit" fullWidth>
          Login
        </Button>
      </form>
    </Layout>
  );
};

export default Page;
