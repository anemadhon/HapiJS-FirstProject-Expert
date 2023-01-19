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
				content: 'content',
			})
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			await commentRepositoryPostgres.AddComment(comment)

			const returnComment = await CommentsTableTestHelper.findCommentsById(
				'thread-123'
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
				content: 'content',
			})
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const addedComment = await commentRepositoryPostgres.AddComment(comment)

			expect(addedComment).toStrictEqual(
				new Comment({
					id: 'thread-123',
					content: 'content',
					owner: 'user-123',
				})
			)
		})
	})
})
