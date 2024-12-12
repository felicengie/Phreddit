// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/client'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.(css|less)$': 'jest-transform-stub',
  },
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    "^react-native$": "react-native-web",
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
