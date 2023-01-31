const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class DeleteCommentUseCase {
	constructor({ commentRepository }) {
		this._commentRepository = commentRepository
	}

	async execute(useCasePayload) {
		await this._commentRepository.checkCommentIsExist(useCasePayload.id)

		const existingComment = await this._commentRepository.getCommentById(
			useCasePayload.id
		)

		if (existingComment && existingComment.owner !== useCasePayload.owner) {
			throw new AuthorizationError(
				'gagal menghapus comment, anda tidak berhak menghapus comment ini.'
			)
		}

		return await this._commentRepository.deleteComment(useCasePayload)
	}
}

module.exports = DeleteCommentUseCase
