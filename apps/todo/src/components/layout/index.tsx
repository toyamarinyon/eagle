import { ReactNode } from "react";
import { layout } from "./index.css";

interface Props {
  children: ReactNode;
}
export const Layout = ({ children }: Props): JSX.Element => {
  return (
    <div className={layout}>
      {children}
    </div>
  );
};
