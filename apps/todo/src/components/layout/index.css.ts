import { style, globalStyle } from "@vanilla-extract/css";
import OP from "open-props";
import { sprinkles } from "../../styles/sprinkles.css";

export const layout = style([
  sprinkles({
    marginX: "auto",
    marginTop: 11
  }),
  {
    width: OP["sizeContent1"],
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
