const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const Comment = require('../../../Domains/comments/entities/Comment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('a CommentRepositoryPostgres', () => {
	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe('addComment function', () => {
		it('should persist add a comment', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const comment = new AddComment({
				thread_id: threads[0].id,
				content: 'content',
				owner: users[0].id,
			})
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			await commentRepositoryPostgres.addComment(comment)

			const returnComment = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(returnComment).toHaveLength(1)
		})
		it('should return added comment correctly', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const comment = new AddComment({
				thread_id: threads[0].id,
				content: 'content',
				owner: users[0].id,
			})
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const addedComment = await commentRepositoryPostgres.addComment(comment)

			expect(addedComment).toStrictEqual(
				new Comment({
					id: 'comment-123',
					content: 'content',
					owner: 'user-123',
				})
			)
		})
	})
	describe('getComment function', () => {
		it('should persist get a comment by thread id', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				thread_id: threads[0].id,
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(comments).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const returnComment = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(returnComment).toHaveLength(1)

			const commentByThreadId = await commentRepositoryPostgres.getComment({
				thread_id: threads[0].id,
			})

			expect(commentByThreadId).toHaveLength(1)
			expect(commentByThreadId[0]).toHaveProperty('id', 'comment-123')
			expect(commentByThreadId[0]).toHaveProperty('content', 'content')
			expect(commentByThreadId[0]).toHaveProperty('username', 'dicoding')
			expect(commentByThreadId[0]).toHaveProperty('is_deleted', false)
			expect(commentByThreadId[0]).toHaveProperty('date')
		})
		it('should return empty array when thread id not found', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-1234'
			)

			expect(comments).toHaveLength(0)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const commentByThreadId = await commentRepositoryPostgres.getComment({
				thread_id: 'thread-12345',
			})

			expect(commentByThreadId).toHaveLength(0)
		})
		it('should return comment by its thread id correctly', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(comments).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const commentByThreadId = await commentRepositoryPostgres.getComment({
				thread_id: threads[0].id,
			})

			expect(commentByThreadId[0].id).toStrictEqual('comment-123')
		})
	})
	describe('getCommentById function', () => {
		it('should persist get a comment by owner', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				thread_id: threads[0].id,
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(comments).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const returnComment = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(returnComment).toHaveLength(1)

			const commentByOwner = await commentRepositoryPostgres.getCommentById(
				returnComment[0].id
			)

			expect(commentByOwner).toHaveProperty('id', returnComment[0].id)
			expect(commentByOwner).toHaveProperty('owner', users[0].id)
			expect(commentByOwner.id).toEqual(returnComment[0].id)
			expect(commentByOwner.owner).toEqual(users[0].id)
		})
		it('should return comment by its thread id correctly', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(comments).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const commentByOwner = await commentRepositoryPostgres.getCommentById(
				comments[0].id
			)

			expect(commentByOwner.id).toStrictEqual(comments[0].id)
			expect(commentByOwner.owner).toStrictEqual(users[0].id)
		})
	})
	describe('checkCommentIsExist function', () => {
		it('should return 404 when comment not found', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-1234'
			)

			expect(comments).toHaveLength(0)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			await expect(
				commentRepositoryPostgres.checkCommentIsExist({
					id: 'comment-1234',
				})
			).rejects.toThrowError('comment tidak ditemukan.')
		})
	})
	describe('deleteComment function', () => {
		it('should persist delete a comment', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				thread_id: threads[0].id,
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(comments).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const returnComment = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(returnComment).toHaveLength(1)

			await commentRepositoryPostgres.deleteComment({
				id: returnComment[0].id,
				owner: users[0].id,
				thread_id: threads[0].id,
			})

			const deletedComment = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(deletedComment).toHaveLength(1)
		})
		it('should return 404 when comment not found', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-1234'
			)

			expect(comments).toHaveLength(0)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			await expect(
				commentRepositoryPostgres.deleteComment({
					id: 'comment-1234',
					owner: users[0].id,
					thread_id: threads[0].id,
				})
			).rejects.toThrowError('gagal menghapus comment, thread tidak ditemukan.')
		})
		it('should return deleted comment status correctly', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				owner: users[0].id,
			})

			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123'
			)

			expect(comments).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const deletedComment = await commentRepositoryPostgres.deleteComment({
				id: comments[0].id,
				owner: users[0].id,
				thread_id: threads[0].id,
			})

			expect(deletedComment).toStrictEqual({ status: 'success' })
		})
	})
})
