const AddComment = require('../AddComment')

describe('a AddComment entities', () => {
	it('should throws an error when content is invalid', () => {
		const emptyPayload = { content: '' }

		expect(() => new AddComment(emptyPayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)

		const nullPayload = { content: null }

		expect(() => new AddComment(nullPayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)

		const undefinedPayload = {}

		expect(() => new AddComment(undefinedPayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)
	})
	it('should throws an error when content is not a string', () => {
		const boolPayload = { content: true }

		expect(() => new AddComment(boolPayload)).toThrowError(
			'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)

		const intPayload = { content: 1 }

		expect(() => new AddComment(intPayload)).toThrowError(
			'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)

		const arrPayload = { content: ['content'] }

		expect(() => new AddComment(arrPayload)).toThrowError(
			'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should create new Comment, return its object', () => {
		const payload = {
			content: 'content',
		}
		const { content } = new AddComment(payload)

		expect(content).toEqual(payload.content)
	})
})
