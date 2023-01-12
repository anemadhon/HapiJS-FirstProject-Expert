/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
	async addThread({
		id = 'thread-123qweasdzxc890',
		title = 'title',
		body = 'body',
	}) {
		const query = {
			text: 'INSERT INTO threads VALUES($1, $2, $3)',
			values: [id, title, body],
		}

		await pool.query(query)
	},

	async findThreadsById(id) {
		const query = {
			text: 'SELECT id, title, body FROM threads WHERE id = $1',
			values: [id],
		}
		const result = await pool.query(query)

		return result.rows
	},

	async cleanTable() {
		await pool.query('DELETE FROM threads WHERE 1=1')
	},
}

module.exports = ThreadsTableTestHelper
