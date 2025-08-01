import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js", "**/*.jsx"], // Apply to JavaScript and JSX files
    plugins: {
      js, // Use the recommended JavaScript rules
    },
    extends: ["js/recommended"], // Extend the recommended rules
    rules: {
      "no-unused-vars": "warn", // Warn on unused variables
      "no-console": "off", // Disable console.log warnings
      eqeqeq: ["error", "always"], // Require === instead of ==
      semi: ["error", "always"], // Require semicolons
      quotes: ["error", "double"], // Require double quotes
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply to TypeScript and TSX files
    extends: ["plugin:@typescript-eslint/recommended"], // Extend recommended TypeScript rules
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Warn on use of 'any' type
    },
  },
]);
