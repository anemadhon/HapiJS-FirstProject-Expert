const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
	it('should throw an error when payload is invalid', () => {
		const incomplatePayload = {
			id: 'comment-123',
		}

		expect(() => new DetailComment(incomplatePayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)

		const invalidPayload = {
			id: null,
			username: '',
			content: '',
			date: '',
		}

		expect(() => new DetailComment(invalidPayload)).toThrowError(
			'CREATE_COMMENT.INVALID_PAYLOAD'
		)
	})
	it('should throws an error when payload values is not a string', () => {
		const invalidPayload = {
			id: 12,
			username: 'usernsmr',
			content: 'dede',
			date: [],
		}

		expect(() => new DetailComment(invalidPayload)).toThrowError(
			'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should return DetailComment object correctly', () => {
		const payload = {
			id: 'comment-123',
			username: 'username',
			content: 'content',
			date: '2023-01-13 09:05:12',
		}
		const { id, username, date, content } = new DetailComment(payload)

		expect(id).toEqual(payload.id)
		expect(username).toEqual(payload.username)
		expect(date).toEqual(payload.date)
		expect(content).toEqual(payload.content)
	})
})
