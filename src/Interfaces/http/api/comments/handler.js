const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')

class CommentsHandler {
	constructor(container) {
		this._container = container
		this.postCommentHandler = this.postCommentHandler.bind(this)
	}

	async postCommentHandler(req, res) {
		const { id: owner } = req.auth.credentials
		const { threadId: thread_id } = req.params
		const addCommentUseCase = this._container.getInstance(
			AddCommentUseCase.name
		)
		const addedComment = await addCommentUseCase.execute({
			...req.payload,
			thread_id,
			owner,
		})

		return res
			.response({
				status: 'success',
				data: { addedComment },
			})
			.code(201)
	}
}

module.exports = CommentsHandler
