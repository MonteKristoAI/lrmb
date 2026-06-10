import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // L10 wave 17 (2026-06-10): shadcn/ui vendor files ship with
  // class-variance-authority `variants` consts alongside the component,
  // and React contexts (auth, i18n) need to export hooks alongside the
  // provider. These exports are intentional — disable the fast-refresh
  // hint for these specific files instead of polluting them with
  // /* eslint-disable */ headers.
  {
    files: [
      "src/components/ui/**/*.{ts,tsx}",
      "src/lib/auth.tsx",
      "src/lib/i18n.tsx",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
