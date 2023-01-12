const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
	afterAll(async () => {
		await pool.end()
	})

	afterEach(async () => {
		await ThreadsTableTestHelper.cleanTable()
	})

	describe('when POST /threads', () => {
		it('should response 201 and persisted thread', async () => {
			const requestPayload = {
				title: 'dicoding',
				body: 'Dicoding Indonesia',
			}
			const server = await createServer(container)
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.addedUser).toBeDefined()
		})
		it('should response 400 when request payload not contain needed property', async () => {
			const requestPayload = {
				title: 'Dicoding Indonesia',
			}
			const server = await createServer(container)
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual(
				'tidak dapat menambah thread baru karena properti yang dibutuhkan tidak ada.'
			)
		})
		it('should response 400 when title / body more than 50 character', async () => {
			const requestPayload = {
				title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
				body: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
			}
			const server = await createServer(container)
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual(
				'tidak dapat menambah thread baru karena karakter title/body melebihi batas limit.'
			)
		})
	})
})
