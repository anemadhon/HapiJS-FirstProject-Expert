const GetThread = require('../../../Domains/threads/entities/GetThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('a GetThreadUseCase', () => {
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
