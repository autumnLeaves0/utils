import path from 'path';

export default () => {
  const file = process.argv.find(arg => /\.test\.js$/.test(arg));
  return {
    rootDir: './',
    transform: {},
    collectCoverage: true,
    collectCoverageFrom: file ? [path.relative('./', file.replace(/\.test\.js$/, '.js'))] : null,
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    }
  };
};
