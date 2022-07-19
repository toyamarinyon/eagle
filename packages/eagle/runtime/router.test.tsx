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
    ["index"]: async () => ({ default: () => <div>index</div> }),
    ["hello"]: async () => ({ default: () => <div>hello</div> }),
    ["subdir/index"]: async () => ({ default: () => <div>subdir index</div> }),
    ["subdir/hello"]: async () => ({ default: () => <div>subdir hello</div> }),
  };

  const hydrateRoutes = {
    ["index"]: "function hydrate(){}",
    ["hello"]: "function hydrate(){}",
    ["subdir/index"]: "function hydrate(){}",
    ["subdir/hello"]: "function hydrate(){}",
  };

  test("return matching page", async () => {
    const { page: indexPage } = await router(
      new Request("http://localhost:8787"),
      routes,
      hydrateRoutes
    );
    expect(indexPage.default({})).toMatchInlineSnapshot(`
      <div>
        index
      </div>
    `);
    const { page: indexPage2 } = await router(
      new Request("http://localhost:8787/"),
      routes,
      hydrateRoutes
    );
    expect(indexPage2.default({})).toMatchInlineSnapshot(`
      <div>
        index
      </div>
    `);

    const { page: helloPage } = await router(
      new Request("http://localhost:8787/hello"),
      routes,
      hydrateRoutes
    );
    expect(helloPage.default({})).toMatchInlineSnapshot(`
      <div>
        hello
      </div>
    `);

    const { page: subdirIndexPage } = await router(
      new Request("http://localhost:8787/subdir/"),
      routes,
      hydrateRoutes
    );
    expect(subdirIndexPage.default({})).toMatchInlineSnapshot(`
      <div>
        subdir index
      </div>
    `);

    const { page: subdirHelloPage } = await router(
      new Request("http://localhost:8787/subdir/hello"),
      routes,
      hydrateRoutes
    );
    expect(subdirHelloPage.default({})).toMatchInlineSnapshot(`
      <div>
        subdir hello
      </div>
    `);
  });
  test("throw an error if there isn't matching routing for pathname", async () => {
    const routing = router(
      new Request("http://localhost:8787/notfound-page"),
      routes,
      hydrateRoutes
    );
    expect(routing).rejects.toThrowError(NotFoundError);
  });
});
