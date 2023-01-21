const CommentRepository = require('../CommentRepository')

describe('CommentRepository interface', () => {
	it('should throw an error when invoke abtract behavior', async () => {
		const commentRepo = new CommentRepository()

		await expect(commentRepo.addComment({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		)
	})
	it('should throw an error when invoke abtract behavior', async () => {
		const commentRepo = new CommentRepository()

		await expect(commentRepo.deleteComment({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		)
	})
	it('should throw an error when invoke abtract behavior', async () => {
		const commentRepo = new CommentRepository()

		await expect(commentRepo.getComment({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		)
	})
	it('should throw an error when invoke abtract behavior', async () => {
		const commentRepo = new CommentRepository()

		await expect(commentRepo.getCommentById('')).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		)
	})
})
