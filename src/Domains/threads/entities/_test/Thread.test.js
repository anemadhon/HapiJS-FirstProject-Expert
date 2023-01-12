const Thread = require('../Thread')

describe('a Thread entities', () => {
	it('should throw an error when given payload is invalid', () => {
		const payload = { title: null }

		expect(() => new Thread(payload)).toThrowError(
			'CREATE_THREAD.INVALID_PAYLOAD'
		)
	})
	it('should created Thread object correctly', () => {
		const payload = { title: 'title', body: 'body' }
		const thread = new Thread(payload)

		expect(thread.title).toEqual(payload.title)
		expect(thread.body).toEqual(payload.body)
	})
})
