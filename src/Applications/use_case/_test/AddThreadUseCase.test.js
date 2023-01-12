const AddThread = require('../../../Domains/threads/entities/AddThread')
const Thread = require('../../../Domains/threads/entities/Thread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('a AddThreadUseCase', () => {
	it('should orchestrating a addThread action correctly', async () => {
		const threadUseCasePayload = {
			title: 'title',
			body: 'body',
			owner: 'user-123',
		}
		const expectedAddedThread = new Thread({
			id: 'thread-123',
			title: threadUseCasePayload.title,
			owner: 'user-123',
		})
		const threadRepoMocked = new ThreadRepository()

		threadRepoMocked.addThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve(expectedAddedThread))

		const getAddThreadUseCase = new AddThreadUseCase({
			threadRepository: threadRepoMocked,
		})
		const addedThread = await getAddThreadUseCase.execute(threadUseCasePayload)

		expect(addedThread).toStrictEqual(
			new Thread({
				id: expectedAddedThread.id,
				title: expectedAddedThread.title,
				owner: expectedAddedThread.owner,
			})
		)
		expect(threadRepoMocked.addThread).toBeCalledWith(
			new AddThread({
				title: threadUseCasePayload.title,
				body: threadUseCasePayload.body,
				owner: expectedAddedThread.owner,
			})
		)
	})
})
