class AddThread {
	constructor({ title, body, owner }) {
		this._verifyPayload({ title, body, owner })

		this.title = title
		this.body = body
		this.owner = owner
	}

	_verifyPayload({ title, body, owner }) {
		if (!title || !body || !owner) {
			throw new Error('CREATE_THREAD.INVALID_PAYLOAD')
		}
		if (
			typeof title !== 'string' ||
			typeof body !== 'string' ||
			typeof owner !== 'string'
		) {
			throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
		if (title.length > 50 || body.length > 50) {
			throw new Error('CREATE_THREAD.PAYLOAD_LIMIT_CHAR')
		}
	}
}

module.exports = AddThread
