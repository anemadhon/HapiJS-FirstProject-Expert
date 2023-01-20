class DeleteCommentUseCase {
	constructor({ commentRepository }) {
		this._commentRepository = commentRepository
	}

	async execute(useCasePayload) {
		const deletedComment = this._commentRepository.deleteComment(useCasePayload)

		return deletedComment.id && deletedComment.is_deleted
			? { status: 'success' }
			: { status: 'fail' }
	}
}

module.exports = DeleteCommentUseCase
