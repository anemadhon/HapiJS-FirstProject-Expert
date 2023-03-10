const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const Comment = require('../../Domains/comments/entities/Comment')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

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

	async getComment(comment) {
		const { thread_id } = comment
		const query = {
			text: `SELECT 
                    comments.id, username, 
                    comments."created_at" as date, 
					comments."is_deleted",
					comments.content
                    FROM comments 
                    LEFT JOIN users 
                    ON comments.owner = users.id 
                    WHERE "thread_id" = $1`,
			values: [thread_id],
		}
		const result = await this._pool.query(query)

		return result.rows
	}

	async getCommentById(id) {
		const query = {
			text: `SELECT id, owner FROM comments WHERE id = $1`,
			values: [id],
		}
		const result = await this._pool.query(query)

		return result.rows[0]
	}

	async checkCommentIsExist({ id, thread_id }) {
		const query = {
			text: `SELECT id FROM comments WHERE id = $1 AND "thread_id" = $2`,
			values: [id, thread_id],
		}
		const result = await this._pool.query(query)

		if (!result.rows.length) {
			throw new NotFoundError('comment tidak ditemukan.')
		}

		return result.rows[0].id
	}

	async deleteComment(comment) {
		const { owner, thread_id, id } = comment
		const query = {
			text: 'UPDATE comments SET "is_deleted" = true WHERE owner = $1 AND "thread_id" = $2 AND id = $3 RETURNING id, "is_deleted"',
			values: [owner, thread_id, id],
		}

		await this._pool.query(query)

		return { status: 'success' }
	}

	async verifyAuthorityAccess({ id, owner }) {
		const query = {
			text: `SELECT owner FROM comments WHERE owner = $1 AND id = $2`,
			values: [owner, id],
		}
		const result = await this._pool.query(query)

		if (!result.rows.length) {
			throw new AuthorizationError(
				'gagal menghapus comment, anda tidak berhak menghapus comment ini.'
			)
		}

		return result.rows[0].owner
	}
}

module.exports = CommentRepositoryPostgres
