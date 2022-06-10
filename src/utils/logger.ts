import chalk from 'chalk'

import { ILoggerOptions } from '@myTypes'

/**
 * Replace HH, mm and ss by the respective values
 * @param format Format string
 * @returns New format replaced
 */
const getTimeString = (format: string): string => {
	const date = new Date()
	let newFormat = format

	const toString = (number) => {
		if (number < 10) return '0' + number.toString()
		else return number.toString()
	}

	const matches = format.match(/[^\w]?(HH|mm|ss)([^\w]|$)/gm)

	matches.forEach((match) => {
		const formatMatch = (content, letter) =>
			(match.charAt(0) === letter ? '' : match.charAt(0)) +
			content +
			match.charAt(match.length - 1)

		const hours = toString(date.getHours())
		const minutes = toString(date.getMinutes())
		const seconds = toString(date.getSeconds())

		if (match.includes('HH'))
			newFormat = newFormat.replace(match, formatMatch(hours, 'H'))
		else if (match.includes('mm'))
			newFormat = newFormat.replace(match, formatMatch(minutes, 'm'))
		else if (match.includes('ss'))
			newFormat = newFormat.replace(match, formatMatch(seconds, 's'))
	})

	return newFormat
}

/**
 * Replace () | [] inside content by a chalk font format
 * Note: [] will not be deleted, only () and {}
 * @param format Format string
 * @returns New format replaced
 */
const replaceFormatString = (format: string): string => {
	const matches = format.match(/(\(|\[)[\w\W]+?(\)|\])/gm)

	let newFormat = format

	matches.forEach((match) => {
		const specialCharacters = match.charAt(0) + match.charAt(match.length - 1)

		if (specialCharacters === '[]') {
			newFormat = newFormat.replace(match, chalk.bold(match))
		} else if (specialCharacters === '()')
			newFormat = newFormat.replace(match, chalk.italic(match.slice(1, -1)))
	})

	return newFormat
}

export default class Logger {
	private static instance: Logger = new Logger('[HH:mm:ss] type (message)', {
		time: true,
	})

	private format: string
	private time: boolean

	constructor(format: string, options?: ILoggerOptions) {
		this.format = replaceFormatString(format)
		this.time = options.time || true
	}

	log(type: string, ...content: any[]) {
		let finalLog = this.format

		if (!this.time)
			finalLog = finalLog.replace(/[^\w]?(HH|mm|ss)([^\w]|$)/gm, '')
		else finalLog = getTimeString(finalLog)

		if (typeof content[0] !== 'string') {
			finalLog = finalLog.replace('type', type).replace('message', '%O')

			return console.log(finalLog, content[0])
		} else {
			finalLog = finalLog
				.replace('type', type)
				.replace('message', content.join(' '))

			return console.log(finalLog)
		}
	}

	info(...message: any[]) {
		this.log(chalk.blue('INFO'), ...message)
	}

	static info(...message: any[]) {
		this.instance.info(...message)
	}

	error(...message: any[]) {
		this.log(chalk.red('ERROR'), ...message)
	}

	static error(...message: any[]) {
		this.instance.error(...message)
	}

	warning(...message: any[]) {
		this.log(chalk.yellow('WARNING'), ...message)
	}

	static warning(...message: any[]) {
		this.instance.warning(...message)
	}

	debug(...message: any[]) {
		this.log(chalk.cyan('DEBUG'), ...message)
	}

	static debug(...message: any[]) {
		this.instance.debug(...message)
	}

	object(...message: any[]) {
		this.log(chalk.grey('OBJECT'), ...message)
	}

	static object(...message: any[]) {
		this.instance.object(...message)
	}
}
