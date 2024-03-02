module.exports = {
  env: { es2021: true },
  extends: [
    '@petra/eslint-config',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['src/generated/**'],
};
