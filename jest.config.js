module.exports = {
  preset: 'react-native',
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|react-clone-referenced-element|react-native-nitro-sound)/)"
  ]
};
