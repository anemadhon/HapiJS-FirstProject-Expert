class AddComment {
	constructor({ content }) {
		this._verifyPayload({ content })

		this.content = content
	}

	_verifyPayload({ content }) {
		if (!content) {
			throw new Error('CREATE_COMMENT.INVALID_PAYLOAD')
		}
		if (typeof content !== 'string') {
			throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = AddComment
