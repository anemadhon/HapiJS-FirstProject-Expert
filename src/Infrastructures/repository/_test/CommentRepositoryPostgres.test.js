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
			expect(commentByThreadId[0]).toHaveProperty(
				'date',
				commentByThreadId[0].date
			)
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
	})
	describe('getCommentById function', () => {
		it('should persist get a comment by id', async () => {
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
			const commnetId = returnComment[0].id

			expect(returnComment).toHaveLength(1)

			const commentByOwner = await commentRepositoryPostgres.getCommentById(
				commnetId
			)

			expect(commentByOwner).toHaveProperty('id', commnetId)
			expect(commentByOwner).toHaveProperty('owner', users[0].id)
			expect(commentByOwner.id).toEqual(commnetId)
			expect(commentByOwner.owner).toEqual(users[0].id)
		})
	})
	describe('checkCommentIsExist function', () => {
		it('should return 404 when threadid & comment not found', async () => {
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
					thread_id: threads[0].id,
				})
			).rejects.toThrowError('comment tidak ditemukan.')
		})
		it('should return comment id correctly', async () => {
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
			const existingComment =
				await commentRepositoryPostgres.checkCommentIsExist({
					id: comments[0].id,
					thread_id: threads[0].id,
				})

			expect(existingComment).toStrictEqual('comment-123')
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

			const isCommentDeleted = await commentRepositoryPostgres.deleteComment({
				id: comments[0].id,
				owner: users[0].id,
				thread_id: threads[0].id,
			})

			expect(isCommentDeleted.status).toStrictEqual('success')
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
	describe('verifyAuthorityAccess function', () => {
		it('should return 403 when user that dont have access try to delete', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })
			await UsersTableTestHelper.addUser({
				id: 'user-1234',
				username: 'username.new',
			})

			const users1 = await UsersTableTestHelper.findUsersById('user-123')
			const users2 = await UsersTableTestHelper.findUsersById('user-1234')

			expect(users1).toHaveLength(1)
			expect(users2).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users1[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				owner: users1[0].id,
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

			await expect(
				commentRepositoryPostgres.verifyAuthorityAccess({
					id: comments[0].id,
					owner: users2[0].id,
				})
			).rejects.toThrowError(
				'gagal menghapus comment, anda tidak berhak menghapus comment ini.'
			)
		})
		it('should return comment owner correctly', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })
			await UsersTableTestHelper.addUser({
				id: 'user-1234',
				username: 'username.new',
			})

			const users1 = await UsersTableTestHelper.findUsersById('user-123')
			const users2 = await UsersTableTestHelper.findUsersById('user-123')

			expect(users1).toHaveLength(1)
			expect(users2).toHaveLength(1)

			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				owner: users1[0].id,
			})

			const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')

			expect(threads).toHaveLength(1)

			await CommentsTableTestHelper.addComment({
				id: 'comment-123',
				owner: users1[0].id,
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

			const verified = await commentRepositoryPostgres.verifyAuthorityAccess({
				id: comments[0].id,
				owner: users1[0].id,
			})

			expect(verified).toStrictEqual(users1[0].id)
		})
	})
})
