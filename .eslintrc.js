module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react-hooks'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  rules: {
    // Spaces always before function parens
    "space-before-function-paren": ["error", "always"],

    // No trailing spaces
    "no-trailing-spaces": ["error", {
      skipBlankLines: true
    }],

    // Semicolons because we're not Neanderthals
    "semi": ['error', 'always'],
    "no-extra-semi": 2,

    // 2-space tabs FTW
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    
    // Camel case control in Typescript
    "camelcase": "off",
    "@typescript-eslint/camelcase": ["error", { "properties": "never" }],
    
    // Let "any" be explicit
    "@typescript-eslint/no-explicit-any": 0,

    "@typescript-eslint/explicit-function-return-type": 2, //{
    //   allowExpressions: true
    // }

    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",

    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  },
  overrides: {
    files: [ "src/**/*.js" ],
    excludedFiles: [ "src/parser/*.js" ]
  }
};