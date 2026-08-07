export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          throws: false,
          exclude: ['**'],
        },
        /**
         * the bundler handles the cjs interop of default imports like `lodash/has`,
         * ts-jest needs esModuleInterop to do the same when it emits commonjs
         */
        tsconfig: {
          esModuleInterop: true,
        },
      },
    ],
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  testMatch: ['<rootDir>/__tests__/**/**.spec.ts', '<rootDir>/src/**/**.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '<rootDir>/lib/'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  testEnvironment: 'jsdom',
  maxWorkers: '50%',
  collectCoverage: Boolean(process.env.COVERAGE),
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['typings', 'generated'],

  coverageReporters: ['text-summary', 'lcov'],

  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};
