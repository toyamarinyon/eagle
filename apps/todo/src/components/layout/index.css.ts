import { style, globalStyle } from "@vanilla-extract/css";
import OP from "open-props";
import { sprinkles } from "../../styles/sprinkles.css";

export const header = style([
  {
    backgroundColor: OP["gray7"],
    height: OP["size7"],
  },
]);
export const headerContent = style([
  sprinkles({
    marginX: "auto",
  }),
  {
    // fontSize: OP["fontSize0"],
    height: '100%',
    width: OP["sizeFluid10"],
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
]);
export const layout = style([
  sprinkles({
    marginX: "auto",
    paddingTop: 9,
  }),
  {
    width: OP["sizeFluid9"],
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
