class DeleteCommentUseCase {
	constructor({ commentRepository }) {
		this._commentRepository = commentRepository
	}

	async execute() {
		return this._commentRepository.deleteComment()
	}
}

module.exports = DeleteCommentUseCase
