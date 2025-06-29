export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          throws: false,
          exclude: ['**'],
        },
      },
    ],
  },

  moduleFileExtensions: ['ts', 'js'],

  testMatch: ['<rootDir>/__tests__/**/**.spec.ts', '<rootDir>/src/**/**.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '<rootDir>/lib/'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  testEnvironment: 'jsdom',
  maxWorkers: '50%',
  collectCoverage: Boolean(process.env.COVERAGE),
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['typings', 'generated'],

  coverageReporters: ['text-summary', 'lcov'],

  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};
