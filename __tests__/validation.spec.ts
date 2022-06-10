import request from 'supertest'

import app from '../src'

describe('GET /boleto', () => {
	it('Deve retornar 200 para um boleto do tipo título válido', async () => {
		const response = await request(app).get(
			`/api/boleto/21290001192110001210904475617405975870000002000`
		)

		expect(response.status).toEqual(200)
		expect(response.body).toMatchObject({
			barCode: '21299758700000020000001121100012100447561740',
			amount: '20.00',
			expirationDate: '2018-07-16',
		})
	})

	it('Deve retornar 200 para um boleto do tipo convênio válido', async () => {
		const response = await request(app).get(
			`/api/boleto/896100000000599800010119053332010064260000157446`
		)

		expect(response.status).toEqual(200)
		expect(response.body).toMatchObject({
			barCode: '89610000000599800010110533320100626000015744',
			amount: '5.99',
			expirationDate: '2010-06-26',
		})
	})

	it('Deve retornar 400 para linhas digitadas inválidas', async () => {
		const response = await request(app).get(
			'/api/boleto/invalidaslinhasdigitadas'
		)

		expect(response.status).toEqual(400)
		expect(response.body.title).toEqual('INVALID_DIGITED_LINES')
	})

	it('Deve retornar 400 para boleto com blocos inválidos do tipo título', async () => {
		const response = await request(app).get(
			'/api/boleto/43280000060228350025006201910798179610000010000'
		)

		expect(response.status).toEqual(400)
		expect(response.body.title).toEqual('INVALID_BLOCKS')
	})

	it('Deve retornar 400 para boleto com digito verificador inválido do tipo título', async () => {
		const response = await request(app).get(
			'/api/boleto/43290000060228350025006201910798179610000010001'
		)

		expect(response.status).toEqual(400)
		expect(response.body.title).toEqual('INVALID_VERIFICATION_DIGIT')
	})

	it('Deve retornar 400 para boleto com blocos inválidos do tipo convênio', async () => {
		const response = await request(app).get(
			'/api/boleto/846100000006990002962019902100030003003459199794'
		)

		expect(response.status).toEqual(400)
		expect(response.body.title).toEqual('INVALID_BLOCKS')
	})

	it('Deve retornar 400 para boleto com digito verificador inválido do tipo convênio', async () => {
		const response = await request(app).get(
			'/api/boleto/848800000043863501622011701159152480778058111230'
		)

		expect(response.status).toEqual(400)
		expect(response.body.title).toEqual('INVALID_VERIFICATION_DIGIT')
	})
})
