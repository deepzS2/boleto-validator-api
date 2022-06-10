import {
	convertDigitedLinesToBarCode,
	convertToBlocks,
} from '../src/utils/converters'

describe('Conversão de linhas digitadas para código de barras', () => {
	it('Deve retornar o código de barra correto do boleto tipo título', () => {
		const digitedLines = '23793381286000782713695000063305975520000370000'
		const barCode = convertDigitedLinesToBarCode(digitedLines, 'bank')

		expect(barCode).toMatch('23799755200003700003381260007827139500006330')
	})

	it('Deve retornar o código de barra correto do boleto tipo convênio', () => {
		const digitedLines = '858900004609524601791605607593050865831483000010'
		const barCode = convertDigitedLinesToBarCode(digitedLines, 'revenue')

		expect(barCode).toMatch('85890000460524601791606075930508683148300001')
	})

	it('Deve retornar a lista de blocos correta do boleto tipo título', () => {
		const digitedLines = '0019050095401448160690680935031437370000000100'
		const blocks = convertToBlocks(digitedLines, 'bank')

		const blocksCodes = blocks.map((block) => block.code)

		expect(blocksCodes).toEqual(['001905009', '4014481606', '0680935031'])
	})

	it('Deve retornar a lista de blocos correta do boleto tipo convênio', () => {
		const digitedLines = '817700000000010936599702411310797039001433708318'
		const blocks = convertToBlocks(digitedLines, 'revenue')

		const blocksCodes = blocks.map((block) => block.code)

		expect(blocksCodes).toEqual([
			'81770000000',
			'01093659970',
			'41131079703',
			'00143370831',
		])
	})
})
