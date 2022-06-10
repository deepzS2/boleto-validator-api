import dayjs from 'dayjs'
import { Request, Response } from 'express'

import {
	convertDigitedLinesToBarCode,
	convertToBlocks,
} from '@utils/converters'
import Logger from '@utils/logger'
import { mod10, mod11 } from '@utils/modsOperations'
import parseDateString from '@utils/parseDateString'

import 'dayjs/locale/pt-br'

const BANK_DIGITED_LINES_REGEX = /^[0-9]{47}$/
const REVENUE_DIGITED_LINES_REGEX = /^8[0-9]{47}/m
const BASE_DATE = dayjs(new Date(1997, 9, 7))

dayjs.locale('pt-br')

export default {
	validate: async (req: Request<{ digitedLines: string }>, res: Response) => {
		const { digitedLines } = req.params

		if (
			!BANK_DIGITED_LINES_REGEX.test(digitedLines) &&
			!REVENUE_DIGITED_LINES_REGEX.test(digitedLines)
		) {
			Logger.debug('Linhas digitadas inválidas')
			return res.status(400).send({
				title: 'INVALID_DIGITED_LINES',
				message:
					'Linhas digitadas inválidas, utilize apenas números e as linhas devem possuir 47 ou 48 digitos',
			})
		}

		if (BANK_DIGITED_LINES_REGEX.test(digitedLines)) {
			Logger.debug('Boleto tipo título')

			const amount = digitedLines.substring(37)
			const expirationFactor = Number(digitedLines.substring(33, 37))
			const barCode = convertDigitedLinesToBarCode(digitedLines, 'bank')
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

			// Valida código de barras e os blocos
			const isBlocksValid = blocks.every(
				(b) => mod10(b.code) === b.verificationDigit
			)

			// Valida o código de barras usando mod11
			const verificationDigit = Number(barCode[4])
			const block = barCode.substring(0, 4) + barCode.substring(5)

			const isValidVerificationDigit =
				mod11(block, 'bank') === verificationDigit

			if (isValidVerificationDigit && isBlocksValid)
				return res.status(200).send({
					barCode,
					amount: Number(amount.substring(0, 8)) + '.' + amount.substring(8),
					expirationDate: BASE_DATE.add(expirationFactor, 'days').format(
						'YYYY-MM-DD'
					),
				})
			else {
				return res.status(400).send({
					title: !isBlocksValid
						? 'INVALID_BLOCKS'
						: 'INVALID_VERIFICATION_DIGIT',
					message: !isValidVerificationDigit
						? 'Boleto possui digito verificador inválido'
						: 'Boleto possui blocos inválidos',
				})
			}
		} else {
			Logger.debug('Boleto tipo convênio')

			const barCode = convertDigitedLinesToBarCode(digitedLines, 'revenue')
			const verificationDigit = Number(barCode[3])
			const currencyCode = {
				digitedLines: Number(digitedLines[2]),
				barCode: Number(barCode[2]),
			}

			const expirationDate = parseDateString(barCode.substring(27, 35))
			const block = barCode.substring(0, 3) + barCode.substring(4)

			const modFnDigitedLines = [6, 7].includes(currencyCode.digitedLines)
				? mod10
				: [8, 9].includes(currencyCode.digitedLines)
				? mod11
				: null
			const modFnBarCode = [6, 7].includes(currencyCode.barCode)
				? mod10
				: [8, 9].includes(currencyCode.barCode)
				? mod11
				: null

			const amount = [6, 8].includes(currencyCode.digitedLines)
				? Number(digitedLines.substring(4, 13)) +
				  '.' +
				  digitedLines.substring(13, 15)
				: Number(digitedLines.substring(4, 15))

			const isValidVerificationDigit = modFnBarCode
				? modFnBarCode(block, 'revenue') === verificationDigit
				: false

			const blocks = convertToBlocks(digitedLines, 'revenue')
			const isBlocksValid = blocks.every(
				(b) => modFnDigitedLines(b.code, 'revenue') === b.verificationDigit
			)

			if (isValidVerificationDigit && isBlocksValid) {
				return res.status(200).send({
					barCode,
					amount,
					expirationDate,
				})
			} else {
				return res.status(400).send({
					title: !isBlocksValid
						? 'INVALID_BLOCKS'
						: 'INVALID_VERIFICATION_DIGIT',
					message: !isBlocksValid
						? 'Boleto possui blocos inválidos'
						: 'Boleto possui digito verificador inválido',
				})
			}
		}
	},
}
