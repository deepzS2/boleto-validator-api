import { Request, Response } from 'express'

import { IApiError } from '@/@types/index'

export default function (err: IApiError, req: Request, res: Response) {
	const response = {
		code: err.status,
	}

	if (err.message) {
		Object.assign(response, { message: err.message })
	}

	res.status(err.status).send(response)
}
