const ThreadRepository = require('../ThreadRepository')

describe('ThreadRepository interface', () => {
	it('should throw an error when invoke abtract behavior', async () => {
		const threadRepo = new ThreadRepository()

		await expect(threadRepo.addThread({})).rejects.toThrowError(
			'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		)
	})
	it('should throw an error when invoke abtract behavior', async () => {
		const threadRepo = new ThreadRepository()

		await expect(threadRepo.getThreadById({})).rejects.toThrowError(
			'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		)
	})
})
