class AddComment {
	constructor({ id, content, owner }) {
		this._verifyPayload({ id, content, owner })

		this.id = id
		this.content = content
		this.owner = owner
	}

	_verifyPayload({ id, content, owner }) {
		if (!id || !content || !owner) {
			throw new Error('CREATE_COMMENT.INVALID_PAYLOAD')
		}
		if (
			typeof id !== 'string' ||
			typeof content !== 'string' ||
			typeof owner !== 'string'
		) {
			throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = AddComment
