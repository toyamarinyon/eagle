import { Button } from "../../components/button";
import { TextAreaField, TextField } from "../../components/form/field";
import { Layout } from "../../components/layout";
import { Heading } from "../../components/typography";
import { sprinkles } from "../../styles/sprinkles.css";

export const page = (): JSX.Element => {
  return (
    <Layout>
      <Heading
        className={sprinkles({
          marginBottom: 6,
        })}
      >
        Add todo
      </Heading>
      <form
        className={sprinkles({
          width: 6,
        })}
      >
        <TextField label="title" name="title" />
        <TextAreaField label="description" name="description" />
        <Button type="submit" fullWidth>
          Add todo
        </Button>
      </form>
    </Layout>
  );
};

export default page;
