module.exports = {
  roots: ['<rootDir>/src/main'],
  testRegex: '(/src/test/.*|\\.test)\\.(ts|js)$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
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
