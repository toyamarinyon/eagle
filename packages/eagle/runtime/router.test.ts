import { expect, test, describe } from "vitest";
import { NotFoundError, pathnameToFilePath, router } from "./router";

describe("pathnameTofFlePath", () => {
  test("/ to index", () => {
    expect(pathnameToFilePath("/")).toBe("index");
  });
  test("/about to about", () => {
    expect(pathnameToFilePath("/about")).toBe("about");
  });
  test("/admin/ to admin/index", () => {
    expect(pathnameToFilePath("/admin/")).toBe("admin/index");
  });
  test("/admin/about to admin/about", () => {
    expect(pathnameToFilePath("/admin/about")).toBe("admin/about");
  });
});

describe("router", () => {
  const routes = {
    ["index"]: async () => ({ default: async () => "index" }),
    ["hello"]: async () => ({ default: async () => "hello" }),
    ["subdir/index"]: async () => ({ default: async () => "subdir index" }),
    ["subdir/hello"]: async () => ({ default: async () => "subdir hello" }),
  };

  test("return matching page", async () => {
    const indexRoute1 = await router(
      new Request("http://localhost:8787"),
      routes
    );
    expect(await indexRoute1.default()).toBe("index");
    const indexRoute2 = await router(
      new Request("http://localhost:8787/"),
      routes
    );
    expect(await indexRoute2.default()).toBe("index");

    const helloRoute = await router(
      new Request("http://localhost:8787/hello"),
      routes
    );
    expect(await helloRoute.default()).toBe("hello");

    const subdirIndexRoute = await router(
      new Request("http://localhost:8787/subdir/"),
      routes
    );
    expect(await subdirIndexRoute.default()).toBe("subdir index");

    const subdirHelloRoute = await router(
      new Request("http://localhost:8787/subdir/hello"),
      routes
    );
    expect(await subdirHelloRoute.default()).toBe("subdir hello");
  });
  test("throw an error if there isn't matching routing for pathname", async () => {
    const routing = router(
      new Request("http://localhost:8787/notfound-page"),
      routes
    );
    expect(routing).rejects.toThrowError(NotFoundError);
  });
});
