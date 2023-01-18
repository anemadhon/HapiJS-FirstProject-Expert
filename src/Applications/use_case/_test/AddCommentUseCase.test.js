const AddComment = require('../../../Domains/comments/entities/AddComment')
const Comment = require('../../../Domains/comments/entities/Comment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('a AddCommentUseCase', () => {
	it('should orchestrating a addComment action correctly', async () => {
		const commentUseCasePayload = {
			title: 'title',
			body: 'body',
			owner: 'user-123',
		}
		const expectedAddedComment = new Comment({
			id: 'comment-123',
			title: commentUseCasePayload.title,
			owner: 'user-123',
		})
		const commentRepoMocked = new CommentRepository()

		commentRepoMocked.addComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve(expectedAddedComment))

		const getAddCommentUseCase = new AddCommentUseCase({
			commentRepository: commentRepoMocked,
		})
		const addedComment = await getAddCommentUseCase.execute(commentUseCasePayload)

		expect(addedComment).toStrictEqual(
			new Comment({
				id: expectedAddedComment.id,
				title: expectedAddedComment.title,
				owner: expectedAddedComment.owner,
			})
		)
		expect(commentRepoMocked.addComment).toBeCalledWith(
			new AddComment({
				title: commentUseCasePayload.title,
				body: commentUseCasePayload.body,
				owner: expectedAddedComment.owner,
			})
		)
	})
})
