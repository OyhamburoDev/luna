// metro.config.js (raíz del proyecto)
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 👇 HABILITA que Metro entienda submódulos de Firebase (muy importante)
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
