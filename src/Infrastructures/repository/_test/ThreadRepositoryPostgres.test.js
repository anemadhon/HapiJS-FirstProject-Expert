const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const Thread = require('../../../Domains/threads/entities/Thread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('a ThreadsTableTestHelper', () => {
	afterEach(async () => {
		await ThreadsTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe('addThread function', () => {
		it('should persist add a thread', async () => {
			const thread = new AddThread({
				title: 'title',
				body: 'body',
			})
			const fakeIdGenerator = () => '123'
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			await threadRepositoryPostgres.addThread(thread)

			const returnThread = await ThreadsTableTestHelper.findThreadsById(
				'thread-123qweasdzxc890'
			)

			expect(returnThread).toHaveLength(1)
		})

		it('should return added thread correctly', async () => {
			const thread = new AddThread({
				title: 'title',
				body: 'body',
			})
			const fakeIdGenerator = () => '123'
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator
			)
			const addedThread = await threadRepositoryPostgres.addThread(thread)

			expect(addedThread).toStrictEqual(
				new Thread({
					id: 'thread-123qweasdzxc890',
					title: 'title',
					body: 'body',
				})
			)
		})
	})
})
