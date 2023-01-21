const GetThread = require('../../Domains/threads/entities/GetThread')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class GetThreadUseCase {
	constructor({ threadRepository, commentRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
	}

	async execute(threadId) {
		const thread = await this._threadRepository.getThreadById(threadId)
		const comments = await this._commentRepository.getCommentByThreadId(
			thread.id
		)

		return new GetThread({
			...thread,
			comments,
		})
	}
}

module.exports = GetThreadUseCase
