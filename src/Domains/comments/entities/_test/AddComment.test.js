const AddComment = require('../AddComment')

describe('a AddComment entities', () => {
	it('should throws an error when payload is invalid', () => {
		const emptyPayload = { content: '', owner: '' }

		expect(() => new AddComment(emptyPayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)

		const nullPayload = { thread_id: '', content: null }

		expect(() => new AddComment(nullPayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)

		const undefinedPayload = {}

		expect(() => new AddComment(undefinedPayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)
	})
	it('should throws an error when payload is not a string', () => {
		const boolPayload = { thread_id: 1, content: true, owner: [] }

		expect(() => new AddComment(boolPayload)).toThrowError(
			'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)

		const intPayload = { thread_id: '1', content: 1, owner: 1 }

		expect(() => new AddComment(intPayload)).toThrowError(
			'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)

		const arrPayload = { thread_id: '1', content: 'true', owner: [] }

		expect(() => new AddComment(arrPayload)).toThrowError(
			'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should create new Comment, return its object', () => {
		const payload = {
			thread_id: 'comment-123',
			content: 'content',
			owner: 'user-123',
		}
		const { id, content, owner } = new AddComment(payload)

		expect(id).toEqual(payload.id)
		expect(content).toEqual(payload.content)
		expect(owner).toEqual(payload.owner)
	})
})
