import { ReactNode } from "react";
import { header, headerContent, layout } from "./index.css";

interface Props {
  showHeader?: boolean;
  children: ReactNode;
  username?: string;
}
export const Layout = ({
  children,
  showHeader = false,
  username,
}: Props): JSX.Element => {
  return (
    <>
      {showHeader && username != null && (
        <header className={header}>
          <section className={headerContent}>
            <p>Hello, {username}</p>
            <div>
              <a href="/logout">Logout</a>
            </div>
          </section>
        </header>
      )}
      <div className={layout}>{children}</div>
    </>
  );
};
