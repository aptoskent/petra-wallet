module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    '@petra/eslint-config'
  ],
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
  rules: {
    "import/no-extraneous-dependencies": [
      "error", 
      {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}
    ]
  }
}
