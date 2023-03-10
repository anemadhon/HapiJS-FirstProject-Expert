class GetThread {
	constructor({ id, title, body, date, username, comments }) {
		this._verifyPayload({ id, title, body, date, username, comments })

		this.id = id
		this.title = title
		this.body = body
		this.date = date
		this.username = username
		this.comments = comments
	}

	_verifyPayload({ id, title, body, date, username, comments }) {
		if (!id || !title || !body || !date || !username || !comments) {
			throw new Error('READ_THREAD.INVALID_PAYLOAD')
		}
		if (
			typeof id !== 'string' ||
			typeof title !== 'string' ||
			typeof body !== 'string' ||
			!(date instanceof Date) ||
			typeof username !== 'string' ||
			!Array.isArray(comments)
		) {
			throw new Error('READ_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = GetThread
