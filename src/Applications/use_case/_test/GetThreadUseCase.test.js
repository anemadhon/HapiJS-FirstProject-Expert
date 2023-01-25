const GetThread = require('../../../Domains/threads/entities/GetThread')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('a GetThreadUseCase', () => {
	it('should orchestrating a getThread action correctly', async () => {
		const threadId = 'thread-123'
		const returnComments = [
			new DetailComment({
				id: 'comment-123',
				username: 'username',
				content: 'content',
				date: '2023-01-13 09:05:12',
			}),
			new DetailComment({
				id: 'comment-123',
				username: 'username',
				content: 'content',
				date: '2023-01-13 09:05:12',
			}),
		]
		const expectedGetThread = new GetThread({
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: '2023-01-13 09:05:12',
			username: 'dicoding',
			comments: returnComments,
		})
		const threadRepoMocked = new ThreadRepository()
		const commentRepoMocked = new CommentRepository()

		threadRepoMocked.addThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		threadRepoMocked.getThreadById = jest.fn().mockImplementation(() =>
			Promise.resolve(
				new GetThread({
					id: 'thread-123',
					title: 'title',
					body: 'body',
					date: '2023-01-13 09:05:12',
					username: 'dicoding',
					comments: returnComments,
				})
			)
		)
		commentRepoMocked.getComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		commentRepoMocked.getCommentById = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		commentRepoMocked.deleteComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		commentRepoMocked.getComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve(returnComments))

		const getThreadUseCase = new GetThreadUseCase({
			threadRepository: threadRepoMocked,
			commentRepository: commentRepoMocked,
		})
		const getThread = await getThreadUseCase.execute({ thread_id: threadId })

		expect(getThread).toEqual(
			new GetThread({
				id: 'thread-123',
				title: 'title',
				body: 'body',
				date: '2023-01-13 09:05:12',
				username: 'dicoding',
				comments: returnComments,
			})
		)
		expect(threadRepoMocked.getThreadById).toBeCalledWith(threadId)
	})
})
