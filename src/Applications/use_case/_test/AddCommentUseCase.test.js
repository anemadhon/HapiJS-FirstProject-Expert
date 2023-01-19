const AddComment = require('../../../Domains/comments/entities/AddComment')
const Comment = require('../../../Domains/comments/entities/Comment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('a AddCommentUseCase', () => {
	it('should orchestrating a addComment action correctly', async () => {
		const commentUseCasePayload = {
			content: 'content',
			thread_id: 'thread-123',
			owner: 'user-123',
		}
		const expectedAddedComment = new Comment({
			id: 'comment-123',
			content: commentUseCasePayload.content,
			owner: 'user-123',
		})
		const threadRepoMocked = new ThreadRepository()
		const commentRepoMocked = new CommentRepository()

		threadRepoMocked.getThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		commentRepoMocked.addComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve(expectedAddedComment))

		const getAddCommentUseCase = new AddCommentUseCase({
			commentRepository: commentRepoMocked,
			threadRepository: threadRepoMocked,
		})
		const addedComment = await getAddCommentUseCase.execute(
			commentUseCasePayload
		)

		expect(addedComment).toStrictEqual(
			new Comment({
				id: expectedAddedComment.id,
				content: expectedAddedComment.content,
				owner: expectedAddedComment.owner,
			})
		)
		expect(commentRepoMocked.addComment).toBeCalledWith(
			new AddComment({
				content: commentUseCasePayload.content,
				thread_id: commentUseCasePayload.thread_id,
				owner: expectedAddedComment.owner,
			})
		)
	})
})
