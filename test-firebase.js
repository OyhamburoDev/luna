// test-firebase.js - archivo temporal para probar imports
try {
  const auth = require("firebase/auth");
  console.log("Exports disponibles:", Object.keys(auth));
} catch (e) {
  console.log("Error:", e);
}
