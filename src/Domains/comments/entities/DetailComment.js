class DetailComment {
	constructor({ id, username, content, date }) {
		this._verifyPayload({ id, username, content, date })

		this.id = id
		this.username = username
		this.content = content
		this.date = date
	}

	_verifyPayload({ id, username, content, date }) {
		if (!id || !username || !content || !date) {
			throw new Error('CREATE_COMMENT.INVALID_PAYLOAD')
		}
		if (
			typeof id !== 'string' ||
			typeof username !== 'string' ||
			typeof content !== 'string' ||
			!(date instanceof Date)
		) {
			throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = DetailComment
