import { globalStyle, style } from "@vanilla-extract/css";
import OP from "open-props";

export const container = style({
  padding: OP.sizeFluid5,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  columnGap: OP["size8"],
});

export const text = style({
  width: OP["sizeContent2"],
  color: OP["gray8"],
});

export const title = style({
  display: "flex",
  flexDirection: "column",
  rowGap: OP["size2"],
});
