const Comment = require('../../../Domains/comments/entities/Comment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const AddCommentUseCase = require('../AddCommentUseCase')

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
