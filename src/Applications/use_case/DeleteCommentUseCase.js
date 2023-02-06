class DeleteCommentUseCase {
	constructor({ commentRepository }) {
		this._commentRepository = commentRepository
	}

	async execute(useCasePayload) {
		await this._commentRepository.checkCommentIsExist(useCasePayload)
		await this._commentRepository.verifyAuthorityAccess(useCasePayload.owner)

		return await this._commentRepository.deleteComment(useCasePayload)
	}
}

module.exports = DeleteCommentUseCase
