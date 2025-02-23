import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import noUnboundedPromiseAll from "./lib/es-rules/no-unbounded-promise-all.js";

export default [
  {
    ignores: ["tailwind.config.js"],
  },
  {
    plugins: {
      sonarjs,
      unicorn,
      "whatsback-rules": {
        rules: {
          "no-unbounded-promise-all": noUnboundedPromiseAll,
        },
      },
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
      ...unicorn.configs.recommended.rules,
      "whatsback-rules/no-unbounded-promise-all": "error",
      "unicorn/prefer-module": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: { req: true, res: true, next: true },
        },
      ],
    },
  },
];
