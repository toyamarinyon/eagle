import { style, globalStyle } from "@vanilla-extract/css";
import OP from "open-props";

const formFieldSelectors = [
  "[type='text']",
  "[type='email']",
  "[type='url']",
  "[type='password']",
  "[type='number']",
  "[type='date']",
  "[type='datetime-local']",
  "[type='month']",
  "[type='search']",
  "[type='tel']",
  "[type='time']",
  "[type='week']",
  "[multiple]",
  "textarea",
  "select",
];

function formFieldSelector(pseudo?: string | null | undefined) {
  return formFieldSelectors
    .map((selector) => {
      return `${selector}${pseudo ? `${pseudo}` : ""}`;
    })
    .join(",");
}
globalStyle(formFieldSelector(), {
  appearance: "none",
  backgroundColor: "transparent",
  borderColor: OP["gray6"],
  borderWidth: OP["borderSize1"],
  borderRadius: OP["radius1"],
  paddingTop: OP["size2"],
  paddingBottom: OP["size2"],
  paddingRight: OP["size2"],
  paddingLeft: OP["size2"],
  fontSize: OP["fontSize1"],
  outline: 0,
});

globalStyle(formFieldSelector(":focus"), {
  borderColor: OP["gray2"],
});

export const fieldSet = style({
  display: "flex",
  flexDirection: "column",
  gap: OP["size2"],
  marginBottom: OP["size4"],
});

export const label = style({
  fontWeight: OP["fontWeight3"],
})
