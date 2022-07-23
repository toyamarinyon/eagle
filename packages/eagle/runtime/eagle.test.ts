import { expect, test } from "vitest";
import { Database, Eagle } from "./eagle";
test("eagle", async () => {
  const db: Database = {
    async get(key: string) {
      return key;
    },
    async query(string) {
      return string;
    },
  };
  Eagle.setDatabase(db);
  expect(await Eagle.getDatabase().get("key")).toBe("key");
});
