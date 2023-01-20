const GetThread = require('../../../Domains/threads/entities/GetThread')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('a GetThreadUseCase', () => {
	it('should orchestrating a getThread action correctly', async () => {
		const threadId = 'thread-123'
		const expectedGetThread = new GetThread({
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: '2023-01-13 09:05:12',
			username: 'dicoding',
			comments: [],
		})
		const returnComments = [
			new DetailComment({
			  id: 'comment-123',
			  username: 'dicoding-a',
			  date: '2023-01-20 11:05:12',
			  content: 'content-a',
			}),
			new DetailComment({
			  id: 'comment-456',
			  username: 'dicoding-b',
			  date: '2023-01-20 1:15:12',
			  content: 'content-b',
			}),
		  ];
		const threadRepoMocked = new ThreadRepository()
		const commentRepoMocked = new CommentRepository()

		threadRepoMocked.getThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(expectedGetThread))
		commentRepoMocked.getCommentByThreadId = jest
			.fn()
			.mockImplementation(() => Promise.resolve(returnComments))

		const getThreadUseCase = new GetThreadUseCase({
			threadRepository: threadRepoMocked,
			commentRepository: commentRepoMocked,
		})
		const getThread = await getThreadUseCase.execute(threadId)

		expect(getThread).toStrictEqual(
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
