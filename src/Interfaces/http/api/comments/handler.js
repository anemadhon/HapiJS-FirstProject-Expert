const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
	constructor(container) {
		this._container = container
		this.postCommentHandler = this.postCommentHandler.bind(this)
		this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
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

	async deleteCommentHandler(req, res) {
		const { id: owner } = req.auth.credentials
		const { threadId: thread_id, commentId: id } = req.params
		const deleteCommentUseCase = this._container.getInstance(
			DeleteCommentUseCase.name
		)
		const deletedComment = await deleteCommentUseCase.execute({
			id,
			thread_id,
			owner,
		})

		return res.response(deletedComment)
	}
}

module.exports = CommentsHandler
