module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  transform: {
    "\\.(ts)x?$": "ts-jest",
    "\\.(js)x?$": "babel-jest",
  },
};
