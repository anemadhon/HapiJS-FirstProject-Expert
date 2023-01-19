const AddComment = require('../../Domains/comments/entities/AddComment')

class AddCommentUseCase {
	constructor({ commentRepository, threadRepository }) {
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
	}

	async execute(useCasePayload) {
		await this._threadRepository.getThreadById(useCasePayload.thread_id)

		const addComment = new AddComment(useCasePayload)

		return this._commentRepository.addComment(addComment)
	}
}

module.exports = AddCommentUseCase
