export function convertDigitedLinesToBarCode(
	lines: string,
	type: 'bank' | 'revenue'
) {
	if (type === 'bank') {
		let barCode = ''

		// Código do banco
		barCode += lines.substring(0, 3)

		// Código da moeda = 9 (Real)
		barCode += lines.substring(3, 4)

		// Digito Verificador
		barCode += lines.substring(32, 33)

		// Fator Vencimento
		barCode += lines.substring(33, 37)

		// Valor
		barCode += lines.substring(37, 47)

		// Campos livres
		barCode += lines.substring(4, 9) // Campo Livre Bloco 1
		barCode += lines.substring(10, 20) // Campo Livre Bloco 2
		barCode += lines.substring(21, 31) // Campo Livre Bloco 3

		return barCode
	} else {
		const barCode = Array.from({ length: 4 })
			.map((_, index) => {
				const start = 11 * index + index
				const end = 11 * (index + 1) + index

				return lines.substring(start, end)
			})
			.join('')

		return barCode
	}
}

export function convertToBlocks(lines: string, type: 'bank' | 'revenue') {
	if (type === 'bank') {
		return [
			{
				code: lines.substring(0, 9),
				verificationDigit: Number(lines.substring(9, 10)),
			},
			{
				code: lines.substring(10, 20),
				verificationDigit: Number(lines.substring(20, 21)),
			},
			{
				code: lines.substring(21, 31),
				verificationDigit: Number(lines.substring(31, 32)),
			},
		]
	} else {
		return Array.from({ length: 4 }, (v, index) => {
			const start = 11 * index + index
			const end = 11 * (index + 1) + index

			return {
				code: lines.substring(start, end),
				verificationDigit: Number(lines.substring(end, end + 1)),
			}
		})
	}
}
