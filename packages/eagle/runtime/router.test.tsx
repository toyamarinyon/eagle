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

  test("return matching page", async () => {
    const indexRoute1 = await router(
      new Request("http://localhost:8787"),
      routes
    );
    expect(indexRoute1.default()).toMatchInlineSnapshot(`
      <div>
        index
      </div>
    `);
    const indexRoute2 = await router(
      new Request("http://localhost:8787/"),
      routes
    );
    expect(indexRoute2.default()).toMatchInlineSnapshot(`
      <div>
        index
      </div>
    `);

    const helloRoute = await router(
      new Request("http://localhost:8787/hello"),
      routes
    );
    expect(helloRoute.default()).toMatchInlineSnapshot(`
      <div>
        hello
      </div>
    `);

    const subdirIndexRoute = await router(
      new Request("http://localhost:8787/subdir/"),
      routes
    );
    expect(subdirIndexRoute.default()).toMatchInlineSnapshot(`
      <div>
        subdir index
      </div>
    `);

    const subdirHelloRoute = await router(
      new Request("http://localhost:8787/subdir/hello"),
      routes
    );
    expect(subdirHelloRoute.default()).toMatchInlineSnapshot(`
      <div>
        subdir hello
      </div>
    `);
  });
  test("throw an error if there isn't matching routing for pathname", async () => {
    const routing = router(
      new Request("http://localhost:8787/notfound-page"),
      routes
    );
    expect(routing).rejects.toThrowError(NotFoundError);
  });
});
