/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
	async addComment({
		id = 'comment-123',
		content = 'content',
		thread_id = 'thread_id',
		owner = 'user-123',
	}) {
		const query = {
			text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
			values: [id, content, thread_id, owner],
		}

		await pool.query(query)
	},

	async findCommentsById(id) {
		const query = {
			text: 'SELECT id, content, owner FROM Comments WHERE id = $1',
			values: [id],
		}
		const result = await pool.query(query)

		return result.rows
	},

	async cleanTable() {
		await pool.query('DELETE FROM comments WHERE 1=1')
	},
}

module.exports = CommentsTableTestHelper
