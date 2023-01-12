class Thread {
	constructor({ id, title, owner }) {
		this._verifyPayload({ id, title, owner })

		this.id = id
		this.title = title
		this.owner = owner
	}

	_verifyPayload({ id, title, owner }) {
		if (!id || !title || !owner) {
			throw new Error('CREATE_THREAD.INVALID_PAYLOAD')
		}
		if (
			typeof id !== 'string' ||
			typeof title !== 'string' ||
			typeof owner !== 'string'
		) {
			throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
		if (title.length > 50) {
			throw new Error('CREATE_THREAD.PAYLOAD_LIMIT_CHAR')
		}
	}
}

module.exports = Thread
