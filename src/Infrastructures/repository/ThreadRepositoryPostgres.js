const Thread = require('../../Domains/threads/entities/Thread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async addThread(thread) {
		const { title, body } = thread
		const id = `thread-${this._idGenerator()}`

		const query = {
			text: 'INSERT INTO threads VALUES($1, $2, $3) RETURNING id, title, body',
			values: [id, title, body],
		}

		const result = await this._pool.query(query)

		return new Thread({ ...result.rows[0] })
	}
}

module.exports = ThreadRepositoryPostgres
