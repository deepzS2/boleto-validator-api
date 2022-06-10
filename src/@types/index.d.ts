export interface IApiError extends Error {
	status?: number
}

export interface ILoggerOptions {
	time?: boolean
}
