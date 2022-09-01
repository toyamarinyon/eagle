import OP from "open-props";
import { recipe } from "@vanilla-extract/recipes";
import { sprinkles } from "../../styles/sprinkles.css";

export const button = recipe({
  base: [
    {
      display: "inline-flex",
      whiteSpace: "nowrap",
      borderRadius: OP["radius1"],
      backgroundColor: OP["indigo8"],
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
