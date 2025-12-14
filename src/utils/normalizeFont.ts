import { PixelRatio } from "react-native";

const MY_SCALE = 1.1;

export const normalizeFont = (size: number) => {
  const userScale = PixelRatio.getFontScale();
  const baseSize = size / userScale;
  return baseSize * MY_SCALE;
};
