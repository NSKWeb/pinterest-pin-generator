// @ts-nocheck
import js from "@eslint/js";
import globals from "globals";
import next from "eslint-config-next";

export default [
  ...js.configs.recommended,
  ...next(),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];