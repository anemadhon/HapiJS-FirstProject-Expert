const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const Thread = require('../../../Domains/threads/entities/Thread')
const pool = require('../../database/postgres/pool')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
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
			// Arrange
			const registerUser = new RegisterUser({
				username: 'dicoding',
				password: 'secret_password',
				fullname: 'Dicoding Indonesia',
			})
			const fakeIdGenerator = () => '123' // stub!
			const userRepositoryPostgres = new UserRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			// Action
			await userRepositoryPostgres.addUser(registerUser)

			// Assert
			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

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
			// Arrange
			const registerUser = new RegisterUser({
				username: 'dicoding',
				password: 'secret_password',
				fullname: 'Dicoding Indonesia',
			})

			const fakeIdGenerator = () => '123' // stub!
			const userRepositoryPostgres = new UserRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			// Action
			await userRepositoryPostgres.addUser(registerUser)

			// Assert
			const users = await UsersTableTestHelper.findUsersById('user-123')

			expect(users).toHaveLength(1)

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
})
