module.exports = {
  collectCoverage: true,
  moduleFileExtensions: [
    'js',
    'json',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    "\\.(css|less)$": "identity-obj-proxy"
  },
  snapshotSerializers: [
  ],
  testMatch: [
    '**/test/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    }
  }
}
