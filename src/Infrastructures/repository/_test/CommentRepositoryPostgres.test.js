const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const AddComment = require('../../../Domains/comments/entities/AddComment')
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
			).rejects.toThrowError('gagal menghapus comment, comment tidak ditemukan.')
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
				id: returnComment[0].id,
				owner: users[0].id,
				thread_id: threads[0].id,
			})

			expect(deletedComment.id).toStrictEqual('comment-123')
			expect(deletedComment.is_deleted).toStrictEqual(true)
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
			).rejects.toThrowError('gagal menghapus comment, comment tidak ditemukan.')
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
				id: returnComment[0].id,
				owner: users[0].id,
				thread_id: threads[0].id,
			})

			expect(deletedComment.id).toStrictEqual('comment-123')
			expect(deletedComment.is_deleted).toStrictEqual(true)
		})
	})
})
