const GetThread = require('../../../Domains/threads/entities/GetThread')
const Thread = require('../../../Domains/threads/entities/Thread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('a GetThreadUseCase', () => {
	it('should throw error when params does not exist', async () => {
		const threadId = ''
		const getThreadUseCase = new GetThreadUseCase({})

		await expect(getThreadUseCase.execute(threadId)).rejects.toThrowError(
			'READ_THREAD.INVALID_PAYLOAD'
		)
	})
	it('should throw error when params not a string', async () => {
		const threadId = 12356
		const getThreadUseCase = new GetThreadUseCase({})

		await expect(getThreadUseCase.execute(threadId)).rejects.toThrowError(
			'READ_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should orchestrating a getThread action correctly', async () => {
		const threadId = 'thread-123'
		const expectedGetThread = new GetThread({
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: '2023-01-13 09:05:12',
			username: 'dicoding',
			comments: [],
		})
		const threadRepoMocked = new ThreadRepository()

		threadRepoMocked.getThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(expectedGetThread))

		const getThreadUseCase = new GetThreadUseCase({
			threadRepository: threadRepoMocked,
		})
		const getThread = await getThreadUseCase.execute(threadId)

		expect(getThread).toStrictEqual(
			new GetThread({
				id: 'thread-123',
				title: 'title',
				body: 'body',
				date: '2023-01-13 09:05:12',
				username: 'dicoding',
				comments: [],
			})
		)
		expect(threadRepoMocked.getThreadById).toBeCalledWith(threadId)
	})
})
