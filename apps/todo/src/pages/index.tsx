import { createHandler } from "meave/handler";
import { app } from "..";
import { Layout } from "../components/layout";
import { Heading } from "../components/typography";
import { sprinkles } from "../styles/sprinkles.css";

export const handler = createHandler<typeof app>().addGuard(
  async ({ session }) => {
    if (session.username == null) {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/login",
        },
      });
    }
  }
);

export const Page = (): JSX.Element => {
  return (
    <Layout>
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
