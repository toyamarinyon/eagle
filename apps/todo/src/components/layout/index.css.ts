import { style, globalStyle } from "@vanilla-extract/css";
import OP from "open-props";
import { sprinkles } from "../../styles/sprinkles.css";

export const header = style([
  {
    backgroundColor: OP["gray8"],
    height: OP["size7"],
  },
]);
export const headerContent = style([
  sprinkles({
    marginX: "auto",
  }),
  {
    height: '100%',
    width: OP["sizeContent3"],
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
]);
export const layout = style([
  sprinkles({
    marginX: "auto",
    paddingTop: 11,
  }),
  {
    width: OP["sizeContent2"],
  },
]);

// globalStyle("*, ::before, ::after", {
//   boxSizing: "border-box",
//   borderWidth: 0,
//   borderStyle: "solid",
//   borderColor: OP["gray5"],
// });

globalStyle("body", {
  backgroundColor: OP["gray9"],
  fontWeight: OP["fontWeight2"],
  color: OP["gray1"],
  fontFamily: OP["fontSans"],
  letterSpacing: OP["fontLetterspacing1"],
});
