class Thread {
	constructor({ id, title, body }) {
		this._verifyPayload({ id, title, body })

		this.id = id
		this.title = title
		this.body = body
	}

	_verifyPayload({ id, title, body }) {
		if (!id || !title || !body) {
			throw new Error('CREATE_THREAD.INVALID_PAYLOAD')
		}
		if (typeof id !== 'string') {
			throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = Thread
