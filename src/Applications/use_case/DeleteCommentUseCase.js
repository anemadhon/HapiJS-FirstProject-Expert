const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class DeleteCommentUseCase {
	constructor({ commentRepository }) {
		this._commentRepository = commentRepository
	}

	async execute(useCasePayload) {
		const existingComment = await this._commentRepository.getCommentById(
			useCasePayload.id
		)

		if (existingComment && existingComment.owner !== useCasePayload.owner) {
			throw new AuthorizationError(
				'gagal menghapus comment, anda tidak berhak menghapus comment ini.'
			)
		}

		const deletedComment = await this._commentRepository.deleteComment(
			useCasePayload
		)

		return deletedComment.id && deletedComment.is_deleted
			? { status: 'success' }
			: { status: 'fail' }
	}
}

module.exports = DeleteCommentUseCase
