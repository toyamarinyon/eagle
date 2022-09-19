import { keyframes, style } from "@vanilla-extract/css";
import OP from "open-props";
import { recipe } from "@vanilla-extract/recipes";

export const blobContainer = style({
  position: "relative",
  width: OP["sizeFluid10"],
  height: 300,
  display: "flex",
  alignItems: "center",
});

const rotateRight = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const rotateLeft = keyframes({
  "0%": { transform: "rotate(360deg)" },
  "100%": { transform: "rotate(0deg)" },
});

export const blobItem = recipe({
  base: {
    position: "absolute",
    opacity: 0.5,
    animation: rotateRight,
    animationDuration: "20s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
    // mixBlendMode: "overlay",
  },
  variants: {
    color: {
      blue: {
        color: OP["blue3"],
      },
      pink: {
        color: OP["pink3"],
      },
      lime: {
        color: OP["lime3"],
      },
      yellow: {
        color: OP["yellow3"],
      },
      grape: {
        color: OP["grape3"],
      },
    },
    animationDirection: {
      right: { animationName: rotateRight },
      left: { animationName: rotateLeft },
    },
    animationDuration: {
      17: { animationDuration: "62s" },
      18: { animationDuration: "120s" },
      19: { animationDuration: "90s" },
      20: { animationDuration: "100s" },
      21: { animationDuration: "110s" },
      22: { animationDuration: "80s" },
    },
  },
});
