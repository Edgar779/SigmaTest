import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts','js','json'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: false, // set true in test:cov script
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/dto/**/*.ts',
    '!src/**/constants/**/*.ts',
    '!src/**/index.ts',
    '!src/**/types/**/*.ts',
    '!src/**/interfaces/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  clearMocks: true,
  verbose: true,
};

export default config;