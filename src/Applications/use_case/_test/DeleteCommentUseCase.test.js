const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('a DeleteCommentUseCase', () => {
	it('should orchestrating a deleteComment action correctly', async () => {
		const commentRepoMocked = new CommentRepository()

		commentRepoMocked.deleteComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve({ status: 'success' }))

		const getDeleteCommentUseCase = new DeleteCommentUseCase({
			commentRepository: commentRepoMocked,
		})
		const deletedComment = await getDeleteCommentUseCase.execute()

		expect(deletedComment).toStrictEqual({ status: 'success' })
	})
})
