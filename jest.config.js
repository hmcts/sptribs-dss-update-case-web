module.exports = {
  roots: ['<rootDir>/src/main'],
  testRegex: '(/src/test/.*|\\.test)\\.(ts|js)$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    // Transform this ESM-only dependency chain for the CommonJS tests on Node 22.
    'node_modules/(query-string|decode-uri-component|filter-obj|split-on-first)/.+\\.js$': [
      'ts-jest',
      { tsconfig: { allowJs: true } },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(query-string|decode-uri-component|filter-obj|split-on-first)/)'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFilesAfterEnv: ['jest-extended'],
  moduleNameMapper: {
    '@hmcts/nodejs-logging': '<rootDir>/src/test/unit/mocks/hmcts/nodejs-logging',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
