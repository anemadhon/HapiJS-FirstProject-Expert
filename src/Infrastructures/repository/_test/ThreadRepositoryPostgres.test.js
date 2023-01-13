const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const Thread = require('../../../Domains/threads/entities/Thread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('a ThreadRepositoryPostgres', () => {
	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe('addThread function', () => {
		it('should persist add a thread', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const thread = new AddThread({
				title: 'title',
				body: 'body',
				owner: 'user-123',
			})
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			await threadRepositoryPostgres.addThread(thread)

			const returnThread = await ThreadsTableTestHelper.findThreadsById(
				'thread-123'
			)

			expect(returnThread).toHaveLength(1)
		})

		it('should return added thread correctly', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' })

			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

			const fakeIdGenerator = () => '123' // stub!
			const thread = new AddThread({
				title: 'title',
				body: 'body',
				owner: 'user-123',
			})
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const addedThread = await threadRepositoryPostgres.addThread(thread)

			expect(addedThread).toStrictEqual(
				new Thread({
					id: 'thread-123',
					title: 'title',
					owner: 'user-123',
				})
			)
		})
	})
	describe('getThreadById function', () => {
		it('should return 404 when thread is not found', async () => {
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

			await UsersTableTestHelper.addUser({ id: 'user-123' })
			await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
			await expect(
				threadRepositoryPostgres.getThreadById('thread-1234')
			).rejects.toThrowError('thread tidak ditemukan.')
		})
		it('should return thread when thread is found', async () => {
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

			await UsersTableTestHelper.addUser({ id: 'user-123' })
			await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

			const theThread = await threadRepositoryPostgres.getThreadById(
				'thread-123'
			)

			expect(theThread).toHaveProperty('id', 'thread-123')
			expect(theThread).toHaveProperty('title', 'title')
			expect(theThread).toHaveProperty('body', 'body')
			expect(theThread).toHaveProperty('username', 'dicoding')
			expect(theThread).toHaveProperty('date')
		})
	})
})
