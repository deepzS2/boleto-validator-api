import { mod10, mod11 } from '../src/utils/modsOperations'

describe('Cálculo de módulos', () => {
	it('Deve retornar os digitos verificadores corretos do módulo 10 (linhas digitadas) de um bloco do tipo título', () => {
		const digitedLines = '0019050095401448160690680935031437370000000100'
		const blocks = [
			{
				code: digitedLines.substring(0, 9),
				verificationDigit: Number(digitedLines.substring(9, 10)),
			},
			{
				code: digitedLines.substring(10, 20),
				verificationDigit: Number(digitedLines.substring(20, 21)),
			},
			{
				code: digitedLines.substring(21, 31),
				verificationDigit: Number(digitedLines.substring(31, 32)),
			},
		]

		const verificationDigits = blocks.map((block) => block.verificationDigit)
		const result = blocks.map((block) => mod10(block.code))

		expect(result).toEqual(verificationDigits)
	})

	it('Deve retornar o digito verificador correto correto do módulo 11 (código de barra) de um bloco do tipo título', () => {
		const barCode = '00193373700000001000500940144816060680935031'
		const block = {
			code: barCode.substring(0, 4) + barCode.substring(5),
			verificationDigit: Number(barCode[4]),
		}

		const result = mod11(block.code, 'bank')

		expect(result).toBe(block.verificationDigit)
	})

	it('Deve retornar o resultado correto do DAC mod10 de um bloco do tipo convênio', () => {
		const block = '01230067896'
		const result = mod10(block)

		expect(result).toBe(3)
	})

	it('Deve retornar o resultado correto do DAC mod10 do dígito verificador geral de um bloco do tipo convênio', () => {
		const barCode = '82210000215048200974123220154098290108605940'
		const block = barCode.substring(0, 3) + barCode.substring(4)

		const result = mod10(block)

		expect(result).toBe(Number(barCode[3]))
	})

	it('Deve retornar o resultado correto do DAC mod11 de um bloco do tipo convênio', () => {
		const block = '01230067896'
		const result = mod11(block, 'revenue')

		expect(result).toBe(0)
	})

	it('Deve retornar o resultado correto do DAC mod11 do dígito verificador geral de um bloco do tipo convênio', () => {
		const barCode = '82200000215048200974123220154098290108605940'
		const block = barCode.substring(0, 3) + barCode.substring(4)

		const result = mod11(block, 'revenue')

		expect(result).toBe(Number(barCode[3]))
	})
})
