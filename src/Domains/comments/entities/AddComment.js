class AddComment {
	constructor({ thread_id, content, owner }) {
		this._verifyPayload({ thread_id, content, owner })

		this.thread_id = thread_id
		this.content = content
		this.owner = owner
	}

	_verifyPayload({ thread_id, content, owner }) {
		if (!thread_id || !content || !owner) {
			throw new Error('CREATE_COMMENT.INVALID_PAYLOAD')
		}
		if (
			typeof thread_id !== 'string' ||
			typeof content !== 'string' ||
			typeof owner !== 'string'
		) {
			throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = AddComment
