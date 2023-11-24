module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "node", "import", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:node/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "prettier",
  ],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
  },
  env: {
    node: true,
  },
};
