import { defineConfig } from 'jest';

export default defineConfig({
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  testPathIgnorePatterns: ['/node_modules/', '/\\.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node'
        }
      }
    ]
  }
});
