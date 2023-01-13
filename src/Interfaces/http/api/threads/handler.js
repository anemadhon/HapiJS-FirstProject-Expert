const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase')

class ThreadsHandler {
	constructor(container) {
		this._container = container
		this.postThreadHandler = this.postThreadHandler.bind(this)
		this.getThreadHandler = this.getThreadHandler.bind(this)
	}

	async postThreadHandler(req, res) {
		const { id: owner } = req.auth.credentials
		const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
		const addedThread = await addThreadUseCase.execute({
			...req.payload,
			owner,
		})

		return res
			.response({
				status: 'success',
				data: { addedThread },
			})
			.code(201)
	}

	async getThreadHandler(req, res) {
		const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name)
		const thread = await getThreadUseCase.execute(req.params.threadId)

		return res.response({
			status: 'success',
			data: {
				thread,
			},
		})
	}
}

module.exports = ThreadsHandler
