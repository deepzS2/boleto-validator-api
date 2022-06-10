/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/?(*.)(spec|test).ts?(x)'],
	moduleNameMapper: {
		'@src/(.*)': '<rootDir>/src/$1',
	},
}
