import parseDateString from '../src/utils/parseDateString'

describe('Parser de data', () => {
	it('Deve retornar uma data caso a data seja válida', () => {
		// AAAAMMDD
		const date = '20030815'

		expect(parseDateString(date)).not.toBeNull()
	})

	it('Deve retornar nulo caso a data seja inválida', () => {
		// AAAAMMDD
		const date = '29513213'

		expect(parseDateString(date)).toBeNull()
	})
})
