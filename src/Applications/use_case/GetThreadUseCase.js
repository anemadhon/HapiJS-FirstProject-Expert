const GetThread = require('../../Domains/threads/entities/GetThread')

class GetThreadUseCase {
	constructor({ threadRepository }) {
		this._threadRepository = threadRepository
	}

	async execute(threadId) {
		this._validateParams(threadId)

		const thread = await this._threadRepository.getThreadById(threadId)

		return new GetThread(thread)
	}

	_validateParams(id) {
		if (!id) {
			throw new Error('READ_THREAD.INVALID_PAYLOAD')
		}

		if (typeof id !== 'string') {
			throw new Error('READ_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = GetThreadUseCase
