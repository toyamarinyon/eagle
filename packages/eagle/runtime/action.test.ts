import { expect, test } from "vitest";
import { z } from "zod";
import { createActions, formProps } from "./action";

test("action", () => {
  const sessionScheme = z.object({
    username: z.string(),
  });
  const actions = createActions<typeof sessionScheme>()
    .addAction("signIn", {
      method: "POST",
      processor: async ({ req, session }) => new Response("Test Response"),
    })
    .addAction("signOut", {
      method: "DELETE",
      processor: async ({ req }) => new Response("Test Response"),
    });
  expect(actions.formProps("signIn")).toStrictEqual({
    method: "POST",
    path: "signIn",
  });
  expect(actions.formProps("signOut")).toStrictEqual({
    method: "DELETE",
    path: "signOut",
  });
});
