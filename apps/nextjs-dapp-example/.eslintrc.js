module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    '@petra/eslint-config',
    'next/core-web-vitals',
  ],
  rules: {
    "react/function-component-definition": 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 0
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    tsconfigRootDir: __dirname,
    project: ["tsconfig.json"],
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
}
