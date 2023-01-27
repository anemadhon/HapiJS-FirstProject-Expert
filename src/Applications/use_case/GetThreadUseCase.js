const GetThread = require('../../Domains/threads/entities/GetThread')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class GetThreadUseCase {
	constructor({ threadRepository, commentRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
	}

	async execute(payload) {
		const thread = await this._threadRepository.getThreadById(payload.thread_id)
		const comments = await this._commentRepository.getComment(payload)

		return new GetThread({ ...thread, comments })
	}
}

module.exports = GetThreadUseCase
