import OP from "open-props";
import { recipe } from "@vanilla-extract/recipes";
import { sprinkles } from "../../styles/sprinkles.css";
import { createVar } from "@vanilla-extract/css";

const fill = createVar()
export const button = recipe({
  base: [
    {
      vars: {
        [fill]: OP["indigo8"],
      },
      display: "inline-flex",
      whiteSpace: "nowrap",
      borderRadius: OP["radius1"],
      backgroundColor: fill,
      color: OP["indigo1"],
      alignItems: "center",
      justifyContent: "center",
      fontWeight: OP["fontWeight5"],
    },
    sprinkles({ paddingY: 2, paddingX: 3 }),
  ],
  variants: {
    fullWidth: {
      true: {
        width: "100%",
      },
    },
  },
});
