const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('a DeleteCommentUseCase', () => {
	it('should orchestrating a deleteComment action correctly', async () => {
		const commentRepoMocked = new CommentRepository()

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

		const isCommentDeleted = await getDeleteCommentUseCase.execute({
			id: 'comment-123',
			thread_id: 'thread-123',
			owner: 'user-123',
		})

		expect(commentRepoMocked.checkCommentIsExist).toHaveBeenCalledWith({
			id: 'comment-123',
			thread_id: 'thread-123',
		})
		expect(commentRepoMocked.verifyAuthorityAccess).toHaveBeenCalledWith({
			id: 'comment-123',
			owner: 'user-123',
		})
		expect(commentRepoMocked.deleteComment).toHaveBeenCalledWith({
			id: 'comment-123',
			thread_id: 'thread-123',
			owner: 'user-123',
		})
		expect(isCommentDeleted).toStrictEqual({ status: 'success' })
	})
})
