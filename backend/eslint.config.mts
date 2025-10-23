import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      ".next",
      "coverage"
    ],
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      sourceType: "module",
    },
    plugins: {
      react,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "react/react-in-jsx-scope": "off",
    },
  }
)
