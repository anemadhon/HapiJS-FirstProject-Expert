const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const Thread = require('../../Domains/threads/entities/Thread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async addThread(thread) {
		const { title, body, owner } = thread
		const id = `thread-${this._idGenerator()}`

		const query = {
			text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
			values: [id, title, body, owner],
		}

		const result = await this._pool.query(query)

		return new Thread({ ...result.rows[0] })
	}

	async getThreadById(id) {
		const query = {
			text: `SELECT threads.id, threads.title, threads.body, threads."created_at" as date, users.username 
                  FROM threads 
                  LEFT JOIN users ON threads.owner = users.id
                  WHERE threads.id = $1`,
			values: [id],
		}
		const result = await this._pool.query(query)

		if (!result.rowCount) {
			throw new NotFoundError('thread tidak ditemukan.')
		}

		return result.rows[0]
	}

	async checkThreadIsExist(id) {
		return (await this.getThreadById(id))
	}
}

module.exports = ThreadRepositoryPostgres
