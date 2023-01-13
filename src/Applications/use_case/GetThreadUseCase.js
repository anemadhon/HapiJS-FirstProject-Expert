const GetThread = require('../../Domains/threads/entities/GetThread')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class GetThreadUseCase {
	constructor({ threadRepository }) {
		this._threadRepository = threadRepository
	}

	async execute(threadId) {
		const thread = await this._threadRepository.getThreadById(threadId)

		return new GetThread({
			...thread,
			comments: [],
		})
	}
}

module.exports = GetThreadUseCase
