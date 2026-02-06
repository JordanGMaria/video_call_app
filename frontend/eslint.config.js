import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import pluginQuasar from "@quasar/app-vite/eslint";
import prettierSkipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
  {
    ignores: [
      "dist/**",
      ".quasar/**",
      "node_modules/**",
      "src-capacitor/**",
      "src-cordova/**",
      "quasar.config.*.temporary.compiled*",
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...pluginQuasar.configs.recommended(),
  prettierSkipFormatting,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        process: "readonly",
      },
    },

    rules: {
      "prefer-promise-reject-errors": "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    },
  },
];
