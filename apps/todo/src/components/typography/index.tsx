import { headingStyle, textStyle } from "./index.css";

interface TextProps {
  children: React.ReactNode;
  className?: string | null | undefined;
}
export const Text = ({ children, className }: TextProps): JSX.Element => {
  return <p className={`${textStyle} ${className}`}>{children}</p>;
};

type HeadingProps = TextProps;

export const Heading = ({ children, className }: HeadingProps): JSX.Element => {
  return <h1 className={`${headingStyle} ${className}`}>{children}</h1>;
};
