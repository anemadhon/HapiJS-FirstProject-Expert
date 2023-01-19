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

	async deleteComment(comment) {
		const { owner, thread_id, id } = comment

		const query = {
			text: 'UPDATE comments SET "is_deleted" = true WHERE owner = $1 AND "thread_id" = $2 AND id = $3 RETURNING id, "is_deleted"',
			values: [owner, thread_id, id],
		}

		const result = await this._pool.query(query)

		return result.rows[0]
	}
}

module.exports = CommentRepositoryPostgres
