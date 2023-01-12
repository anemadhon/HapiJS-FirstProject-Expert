const AddThread = require('../../../Domains/threads/entities/AddThread')
const Thread = require('../../../Domains/threads/entities/Thread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('a AddThreadUseCase', () => {
	it('should orchestrating a addThread action correctly', async () => {
		const threadUseCasePayload = {
			title: 'title',
			body: 'body',
		}
		const expectedAddedThread = new Thread({
			id: 'thread-123qweasdzxc890',
			title: threadUseCasePayload.title,
			body: threadUseCasePayload.body,
		})
		const threadRepoMocked = new ThreadRepository()

		threadRepoMocked.addThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve(expectedAddedThread))

		const getAddThreadUseCase = new AddThreadUseCase({
			threadRepository: threadRepoMocked,
		})
		const addedThread = await getAddThreadUseCase.execute(threadUseCasePayload)

		expect(addedThread).toStrictEqual(expectedAddedThread)
		expect(threadRepoMocked.addThread).toBeCalledWith(
			new AddThread({
				title: 'title one',
				body: 'body one',
			})
		)
	})
})
