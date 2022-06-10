import dayjs from 'dayjs'

export default function (date: string) {
	const year = Number(date.substring(0, 4))
	const month = Number(date.substring(4, 6))
	const day = Number(date.substring(6, 8))

	if (year < 1997 || year > 2050) {
		return null
	} else if (month > 12 || month < 1) {
		return null
	} else if (day < 1 || day > 31) {
		return null
	} else {
		return dayjs(date).format('YYYY-MM-DD')
	}
}
