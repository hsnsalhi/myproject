/** Tests de la physique et du moteur, sans rendu : le preset node de jest-expo suffit. */
module.exports = {
  preset: 'jest-expo/node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
}
