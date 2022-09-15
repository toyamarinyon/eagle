import { createHandler, inferProps } from "wille/handler";
import { app } from "..";
import { Layout } from "../components/layout";
import { Heading } from "../components/typography";
import { sprinkles } from "../styles/sprinkles.css";

export const handler = createHandler<typeof app>()
  .addGuard(async ({ session }) => {
    if (session.username == null) {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/login",
        },
      });
    }
  })
  .addPropsResolver(async ({ session }) => {
    return {
      username: session.username,
    };
  });

export const Page = ({ username }: inferProps<typeof handler>): JSX.Element => {
  return (
    <Layout showHeader username={username}>
      <Heading
        className={sprinkles({
          marginBottom: 6,
        })}
      >
        todo
      </Heading>
      <ul></ul>
      <a href="/tasks/new">+ Add task</a>
    </Layout>
  );
};

export default Page;
