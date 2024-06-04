import babelParser from "@babel/eslint-parser";

export default [
  {
    files: ["src/**/*.js", "src/**/*.jsx", "src/**/*.mjs"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          // your babel options
          presets: [
              "@babel/preset-env",
            "@babel/preset-react"
          ],
        }
      }
    },
    rules: {
      quotes: ["error", "single"],
      semi: ["error", "always"],
      indent: [
        2,
        2,
        {
          SwitchCase: 1,
        },
      ],
    }
  }
];