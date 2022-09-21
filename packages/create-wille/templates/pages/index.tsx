import { Blob } from "../components/blob";
import { Logo } from "../components/logo";
import { container, text, title } from "../styles/styles.css";

export default function HelloWorld() {
  return (
    <div className={container}>
      <section className={title}>
        <Logo />
        <p className={text}>
          Render React components on the edge and hydration on the browser.
        </p>
      </section>
      <Blob />
    </div>
  );
}
