const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' } )

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper,
  modulePathIgnorePatterns: [
    ".yalc/*"
  ],
};
