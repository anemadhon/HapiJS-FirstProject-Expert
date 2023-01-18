const CommentRepository = require('../CommentRepository')

describe('CommentRepository interface', () => {
	it('should throw an error when invoke abtract behavior', async () => {
		const CommentRepo = new CommentRepository()

		await expect(CommentRepo.addComment({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		)
	})
})
