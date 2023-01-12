const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const GetCredentialTestHelper = require('../../../../tests/GetCredentialTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
	afterAll(async () => {
		await pool.end()
	})

	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await AuthenticationsTableTestHelper.cleanTable()
	})

	describe('when POST /threads', () => {
		it('should response 201 and persisted thread', async () => {
			const requestPayload = {
				title: 'dicoding',
				body: 'Dicoding Indonesia',
			}
			const server = await createServer(container)
			const { accessToken } = await GetCredentialTestHelper({ server })
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.addedThread).toBeDefined()
		})
		it('should response 400 when request payload not contain needed property', async () => {
			const requestPayload = {
				title: 'Dicoding Indonesia',
			}
			const server = await createServer(container)
			const { accessToken } = await GetCredentialTestHelper({ server })
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
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
			const { accessToken } = await GetCredentialTestHelper({ server })
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
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
