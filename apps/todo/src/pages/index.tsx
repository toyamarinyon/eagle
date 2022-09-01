import { useState } from "react";
import { Button } from "../components/button";
import { FormField } from "../components/form/field";
import { Layout } from "../components/layout";
import { Heading } from "../components/typography";
import { sprinkles } from "../styles/sprinkles.css";

export const pageProps = async () => {
  return {
    message: "Hello World",
  };
};

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
      <form>
        <FormField />
        <Button type="submit" fullWidth>
          Login
        </Button>
      </form>
    </Layout>
  );
};

export default Page;
