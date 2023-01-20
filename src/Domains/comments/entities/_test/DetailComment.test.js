const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
	it('should throw an error when payload is invalid', () => {
		const incomplatePayload = {
			thread_id: 'thread-123',
		}

		expect(() => new DetailComment(incomplatePayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)

		const invalidPayload = {
			thread_id: null,
			owner: '',
		}

		expect(() => new DetailComment(invalidPayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)
	})
	it('should throws an error when payload values is not a string', () => {
		const invalidPayload = {
			thread_id: 'content',
			owner: true,
		}

		expect(() => new DetailComment(invalidPayload)).toThrowError(
			'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should return DetailComment object correctly', () => {
		const payload = {
			thread_id: 'thread-123',
			owner: 'user-123',
		}
		const { id, username, date, content } = new DetailComment(payload)

		expect(id).toEqual(payload.id)
		expect(username).toEqual(payload.username)
		expect(date).toEqual(payload.date)
		expect(content).toEqual(payload.content)
	})
})
