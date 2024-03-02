import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
};

export default config;
