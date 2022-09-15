import { style } from "@vanilla-extract/css";
import OP from "open-props";

export const textStyle = style({});

export const headingStyle = style({
  fontSize: OP["fontSize4"],
  fontWeight: OP["fontWeight5"],
  letterSpacing: OP["fontLetterspacing2"]
});
