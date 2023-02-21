const GetThread = require('../../../Domains/threads/entities/GetThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('a GetThreadUseCase', () => {
	it('should orchestrating a getThread action correctly with deleted comments', async () => {
		const threadId = 'thread-123'
		const returnDate = new Date()
		const threads = {
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: returnDate,
			username: 'dicoding',
		}
		const returnComments = [
			{
				id: 'comment-456',
				username: 'username',
				content: '**komentar telah dihapus**',
				is_deleted: true,
				date: returnDate,
			},
		]
		const threadRepoMocked = new ThreadRepository()
		const commentRepoMocked = new CommentRepository()

		threadRepoMocked.getThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(threads))
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
				...threads,
				comments: [
					{
						id: 'comment-456',
						username: 'username',
						content: '**komentar telah dihapus**',
						date: returnDate,
					},
				],
			})
		)
		expect(getThread.comments).toHaveLength(1)
		expect(getThread.comments[0].content).toStrictEqual(
			'**komentar telah dihapus**'
		)
		expect(threadRepoMocked.getThreadById).toBeCalledWith(threadId)
		expect(commentRepoMocked.getComment).toBeCalledWith({ thread_id: threadId })
	})
	it('should orchestrating a getThread action correctly', async () => {
		const threadId = 'thread-123'
		const returnDate = new Date()
		const threads = {
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: returnDate,
			username: 'dicoding',
		}
		const returnComments = [
			{
				id: 'comment-123',
				username: 'username',
				content: 'content',
				is_deleted: false,
				date: returnDate,
			},
			{
				id: 'comment-456',
				username: 'username',
				content: 'content',
				is_deleted: false,
				date: returnDate,
			},
		]
		const threadRepoMocked = new ThreadRepository()
		const commentRepoMocked = new CommentRepository()

		threadRepoMocked.getThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(threads))
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
				...threads,
				comments: [
					{
						id: 'comment-123',
						username: 'username',
						content: 'content',
						date: returnDate,
					},
					{
						id: 'comment-456',
						username: 'username',
						content: 'content',
						date: returnDate,
					},
				],
			})
		)
		expect(threadRepoMocked.getThreadById).toBeCalledWith(threadId)
		expect(commentRepoMocked.getComment).toBeCalledWith({ thread_id: threadId })
	})
})
