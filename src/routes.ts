import express from 'express'

import BoletosController from './controllers/BoletosController'

const router = express.Router()

router.get('/boleto/:digitedLines', BoletosController.validate)

export default router
