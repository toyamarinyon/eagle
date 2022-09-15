import { createHandler, formProps, inferProps } from "wille/handler";
import { z } from "zod";
import { app } from "../..";
import { Button } from "../../components/button";
import { TextAreaField, TextField } from "../../components/form/field";
import { Layout } from "../../components/layout";
import { Heading } from "../../components/typography";
import { sprinkles } from "../../styles/sprinkles.css";

export const handler = createHandler<typeof app>()
  .addAction("login", {
    input: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
    resolve: async ({ req, session, input }) => {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/",
        },
      });
    },
  })
  .addPropsResolver(async ({ session }) => {
    return {
      username: session.username,
    };
  });
export const page = ({ username }: inferProps<typeof handler>): JSX.Element => {
  return (
    <Layout showHeader username={username}>
      <Heading
        className={sprinkles({
          marginBottom: 6,
        })}
      >
        Add todo
      </Heading>
      <form {...formProps<typeof handler>("login")}>
        <TextField label="Title" name="title" />
        <TextAreaField label="Description" name="description" />
        <Button type="submit" fullWidth>
          Add todo
        </Button>
      </form>
    </Layout>
  );
};

export default page;
