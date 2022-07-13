import { ReactElement } from "react";

export interface Page {
  default: () => Promise<ReactElement>;
}
