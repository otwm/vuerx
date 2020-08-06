module.exports = {
  testEnvironment: 'node',
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    'vee-validate/dist/rules': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**'
  ],
  coverageReporters: [
    'html',
    'text-summary',
    'lcov'
  ],
  watchPathIgnorePatterns: [ 'node_modules' ],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: './tsconfig.jest.json'
    }
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!vee-validate/dist/rules)',
  ],
  testPathIgnorePatterns: [
    'node_modules'
  ],
}
