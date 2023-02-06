const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('a DeleteCommentUseCase', () => {
	it('should orchestrating a deleteComment action correctly', async () => {
		const commentRepoMocked = new CommentRepository()

		commentRepoMocked.addComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		commentRepoMocked.getComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		commentRepoMocked.getCommentById = jest
			.fn()
			.mockImplementation(() =>
				Promise.resolve({ id: 'comment-123', owner: 'user-123' })
			)
		commentRepoMocked.checkCommentIsExist = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		commentRepoMocked.verifyAuthorityAccess = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		commentRepoMocked.deleteComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve({ status: 'success' }))

		const getDeleteCommentUseCase = new DeleteCommentUseCase({
			commentRepository: commentRepoMocked,
		})

		await getDeleteCommentUseCase.execute({
			id: 'comment-123',
			thread_id: 'thread-123',
			owner: 'user-123',
		})

		expect(commentRepoMocked.deleteComment).toHaveBeenCalledWith({
			id: 'comment-123',
			thread_id: 'thread-123',
			owner: 'user-123',
		})
	})
})
