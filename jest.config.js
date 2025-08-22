module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|expo-.*|@expo|@expo-.*|@testing-library|@react-native-async-storage/async-storage|@react-native\\js-polyfills)',
    ],
};