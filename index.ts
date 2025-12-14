import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

import { PixelRatio } from "react-native";

console.log("fontScale:", PixelRatio.getFontScale());
console.log("pixelRatio:", PixelRatio.get());
