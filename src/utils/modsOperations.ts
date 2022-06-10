export function mod10(block: string) {
	const code = block.split('').reverse()

	const total = code.reduce((acc, current, index) => {
		let sum = Number(current) * (((index + 1) % 2) + 1)
		sum = sum > 9 ? Math.trunc(sum / 10) + (sum % 10) : sum
		return acc + sum
	}, 0)

	return Math.ceil(total / 10) * 10 - total
}

export function mod11(block: string, type: 'bank' | 'revenue') {
	const code = block.split('').reverse()

	let multiplier = 2

	const total = code.reduce((acc, curr) => {
		const sum = Number(curr) * multiplier
		multiplier = multiplier === 9 ? 2 : multiplier + 1
		return acc + sum
	}, 0)

	const moduleDivision = total % 11

	if (type === 'bank') {
		const DV = 11 - moduleDivision

		if (DV === 0 || DV === 10 || DV === 11) return 1
		else return DV
	} else {
		if ([0, 1].includes(moduleDivision)) return 0
		else if (moduleDivision === 10) return 1

		return 11 - moduleDivision
	}
}
