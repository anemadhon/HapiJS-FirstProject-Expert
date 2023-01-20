class Comment {
	constructor({ id, username, date, content }) {
		this._verifyPayload({ id, username, date, content })

		this.id = id
		this.username = username
		this.date = date
		this.content = content
	}

	_verifyPayload({ id, username, date, content }) {
		if (!id || !username || !date || !content ) {
			throw new Error('CREATE_COMMENT.INVALID_PAYLOAD')
		}
		if (
			typeof id !== 'string' ||
			typeof username !== 'string' ||
			typeof date !== 'string' ||
			typeof content !== 'string'
		) {
			throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = Comment
