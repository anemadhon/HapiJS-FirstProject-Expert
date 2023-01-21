const GetThread = require('../../Domains/threads/entities/GetThread')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class GetThreadUseCase {
	constructor({ threadRepository, commentRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
	}

	async execute(payload) {
		const thread = await this._threadRepository.getThreadById(payload.thread_id)
		let comments = await this._commentRepository.getComment(payload)

		comments =
			comments.length > 0
				? comments.map(comment => {
						return {
							id: comment.id,
							username: comment.username,
							date: comment.date,
							content: comment.is_deleted
								? '**komentar telah dihapus**'
								: comment.content,
						}
				  })
				: comments

		return new GetThread({
			...thread,
			comments,
		})
	}
}

module.exports = GetThreadUseCase
