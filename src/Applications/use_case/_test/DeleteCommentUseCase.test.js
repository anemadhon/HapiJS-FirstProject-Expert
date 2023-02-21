const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('a DeleteCommentUseCase', () => {
	it('should orchestrating a deleteComment action correctly', async () => {
		const commentRepoMocked = new CommentRepository()
		const payload = {
			id: 'comment-123',
			thread_id: 'thread-123',
			owner: 'user-123',
		}

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

		const isCommentDeleted = await getDeleteCommentUseCase.execute(payload)

		expect(commentRepoMocked.checkCommentIsExist).toHaveBeenCalledWith(payload)
		expect(commentRepoMocked.verifyAuthorityAccess).toHaveBeenCalledWith(
			payload
		)
		expect(commentRepoMocked.deleteComment).toHaveBeenCalledWith(payload)
		expect(isCommentDeleted).toStrictEqual({ status: 'success' })
	})
})
