import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/node_modules', '**/dist', '**/build', '**/__snapshots__', '**/mocks', '**/coverage'],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-this-alias": [
        "warn",
        {
          "allowedNames": [
            "me"
          ]
        }
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "off"
    }
  }
];