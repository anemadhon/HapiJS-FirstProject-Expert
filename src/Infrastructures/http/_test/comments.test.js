const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const GetCredentialTestHelper = require('../../../../tests/GetCredentialTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments endpoint', () => {
	afterAll(async () => {
		await pool.end()
	})

	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
		await AuthenticationsTableTestHelper.cleanTable()
	})

	describe('when POST /threads/{threadId}/comments', () => {
		it('should response 201 and persisted comment', async () => {
            const server = await createServer(container)
			const { accessToken } = await GetCredentialTestHelper({ server })
            const threadId = 'thread-123'

            await UsersTableTestHelper.addUser({ id: 'user-123' })
			await ThreadsTableTestHelper.addThread({
				id: threadId,
				owner: 'user-123',
			})

			const requestCommentPayload = {
				content: 'content',
			}
			const responseComment = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: requestCommentPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			const responseCommentJson = JSON.parse(responseComment.payload)

			expect(responseComment.statusCode).toEqual(201)
			expect(responseCommentJson.status).toEqual('success')
			expect(responseCommentJson.data.addedComment).toBeDefined()
		})
		it('should response 404 when thread id not found', async () => {
			const requestPayload = {
				content: '',
			}
			const server = await createServer(container)
			const { accessToken } = await GetCredentialTestHelper({ server })
			const response = await server.inject({
				method: 'POST',
				url: '/threads/123/comments',
				payload: requestPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(404)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('thread tidak ditemukan.')
		})
		it('should response 400 when request payload not contain needed property', async () => {
			const server = await createServer(container)
			const { accessToken } = await GetCredentialTestHelper({ server })
            const threadId = 'thread-123'

            await UsersTableTestHelper.addUser({ id: 'user-123' })
			await ThreadsTableTestHelper.addThread({
				id: threadId,
				owner: 'user-123',
			})

			const requestCommentPayload = {}
			const responseComment = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: requestCommentPayload,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			const responseCommentJson = JSON.parse(responseComment.payload)

			expect(responseComment.statusCode).toEqual(400)
			expect(responseCommentJson.status).toEqual('fail')
			expect(responseCommentJson.message).toEqual(
				'tidak dapat menambah comment baru karena properti yang dibutuhkan tidak ada.'
			)
		})
		it('should respond 401 when no access token provided', async () => {
			const requestPayload = {
				content: 'lorem ipsum',
			}
			const server = await createServer(container)
			const response = await server.inject({
				method: 'POST',
				url: '/threads/{threadId}/comments',
				payload: requestPayload,
			})
			const responseJson = JSON.parse(response.payload)

			expect(response.statusCode).toEqual(401)
			expect(responseJson.error).toEqual('Unauthorized')
			expect(responseJson.message).toEqual('Missing authentication')
		})
	})
})