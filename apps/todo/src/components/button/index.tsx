import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { button } from "./index.css";
type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  fullWidth?: boolean;
};
export const Button = ({ type, children, fullWidth }: Props): JSX.Element => {
  return (
    <button
      className={button({
        fullWidth,
      })}
      type={type}
    >
      {children}
    </button>
  );
};
