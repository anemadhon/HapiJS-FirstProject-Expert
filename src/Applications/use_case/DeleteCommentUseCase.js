class DeleteCommentUseCase {
	constructor({ commentRepository }) {
		this._commentRepository = commentRepository
	}

	async execute() {
        const deletedComment = this._commentRepository.deleteComment()

		return deletedComment.id && deletedComment.is_deleted ? { status: 'success' } : { status: 'fail' }
	}
}

module.exports = DeleteCommentUseCase
