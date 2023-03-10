const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
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
		await CommentsTableTestHelper.cleanTable()
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
		it('should respond 401 when no access token provided', async () => {
			const requestPayload = {
				title: 'lorem ipsum',
				body: 'dolor sit amet',
			}
			const server = await createServer(container)
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(401)
			expect(responseJson.error).toEqual('Unauthorized')
			expect(responseJson.message).toEqual('Missing authentication')
		})
	})
	describe('when GET /threads/{threadId}', () => {
		it('should respond with 200 and with thread details with empty comments', async () => {
			const server = await createServer(container)
			const threadId = 'thread-123'

			await UsersTableTestHelper.addUser({ id: 'user-123' })
			await ThreadsTableTestHelper.addThread({
				id: threadId,
				owner: 'user-123',
			})

			const response = await server.inject({
				method: 'GET',
				url: `/threads/${threadId}`,
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data).toBeDefined()
			expect(responseJson.data.thread).toBeDefined()
			expect(responseJson.data.thread.comments).toHaveLength(0)
		})
		it('should respond with 200 and with thread details with comments', async () => {
			const server = await createServer(container)
			const threadId = 'thread-123'

			await UsersTableTestHelper.addUser({ id: 'user-123' })
			await ThreadsTableTestHelper.addThread({
				id: threadId,
				owner: 'user-123',
			})
			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				content: 'content-a',
				owner: 'user-123',
			})
			await CommentsTableTestHelper.addComment({
				id: 'comment-456',
				content: 'content-b',
				owner: 'user-123',
			})

			const response = await server.inject({
				method: 'GET',
				url: `/threads/${threadId}`,
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data).toBeDefined()
			expect(responseJson.data.thread).toBeDefined()
			expect(responseJson.data.thread.comments).toHaveLength(2)
		})
		it('should respond with 404 if thread does not exist', async () => {
			const server = await createServer(container)
			const response = await server.inject({
				method: 'GET',
				url: '/threads/123',
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(404)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('thread tidak ditemukan.')
		})
	})
})
