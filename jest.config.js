/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/?(*.)(spec|test).ts?(x)'],
	moduleNameMapper: {
		'@/(.*)': '<rootDir>/src/$1',
		'@utils/(.*)': '<rootDir>/src/utils/$1',
		'@controllers/(.*)': '<rootDir>/src/controllers/$1',
	},
}
