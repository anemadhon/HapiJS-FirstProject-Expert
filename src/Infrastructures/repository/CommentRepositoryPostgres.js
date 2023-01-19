const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const Comment = require('../../Domains/comments/entities/Comment')
const CommentRepository = require('../../Domains/comments/CommentRepository')

class CommentRepositoryPostgres extends CommentRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async addComment(comment) {
		const { content, thread_id, owner } = comment
		const id = `comment-${this._idGenerator()}`

		const query = {
			text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
			values: [id, content, thread_id, owner],
		}

		const result = await this._pool.query(query)

		return new Comment({ ...result.rows[0] })
	}
}

module.exports = CommentRepositoryPostgres
