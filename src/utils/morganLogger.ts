import chalk from 'chalk'
import { FormatFn } from 'morgan'

const getStatusColor = (status) =>
	status >= 500
		? chalk.red
		: status >= 400
		? chalk.yellow
		: status >= 300
		? chalk.cyan
		: status >= 200
		? chalk.green
		: chalk.italic

export const morganLogger: FormatFn = (tokens, req, res) => {
	const status = tokens.status(req, res)
	const statusColor = getStatusColor(status)

	const content = [
		chalk.bold(tokens.method(req, res)),
		tokens.url(req, res),
		statusColor(status),
		tokens.res(req, res, 'content-length'),
		'-',
		tokens['response-time'](req, res),
		'ms',
	].join(' ')

	return content
}

export default morganLogger
