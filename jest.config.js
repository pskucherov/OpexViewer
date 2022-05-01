module.exports = {
    rootDir: './',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '\\.js$': ['babel-jest', { configFile: '<rootDir>/.babelrc' }],
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    },
    verbose: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: ['<rootDir>/__test__/test-utils.js'],
};
