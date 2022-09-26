# Creating a new page

<!-- In Wille, a page is a React Component exported from a `.tsx` files in the `pages` directory. -->

Wille is heavily inspired [Next.js](https://nextjs.org/) project and its APIs.

A page is a React Component exported from a `.tsx` files in the `pages` directory.

**Example**: If you create `pages/about.tsx` that exports a React component like below, it will be accessible at `/about`.

```tsx
// src/pages/about.tsx
function About() {
  return <div>About</div>
}

export default About
```