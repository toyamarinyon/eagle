import { defineConfig } from "vitepress";

export default defineConfig({
  title: "VitePress",
  description: "Just playing around.",
  themeConfig: {
    // logo: "/logo.svg",
    siteTitle: "Wille",
    // siteTitle: false,
    sidebar: [
      {
        text: "Introduction",
        collapsible: true,
        items: [
          { text: "What is Wille?", link: "/guide/what-is-wille" },
          { text: "Acknowledgements", link: "/guide/acknowledgements" },
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Create a new page", link: "/guide/create-a-new-page" },
          {
            text: "Create a page handler",
            link: "/guide/create-a-page-handler",
          },
          { text: "Create a session", link: "/guide/create-a-session" },
        ],
      },
      {
        text: "Tutorial",
        collapsible: true,
        items: [
          {
            text: "Create a todo management webpage",
            link: "tutorial/create-a-todo-management-webpage",
          },
          {
            text: "Set up",
            link: "tutorial/set-up",
          },
          {
            text: "Create a login page",
            link: "tutorial/create-a-login-page",
          },
          {
            text: 'Create a todo list page',
            link: 'tutorial/create-a-todo-list-page',
          }
        ],
      },
    ],
  },
});
