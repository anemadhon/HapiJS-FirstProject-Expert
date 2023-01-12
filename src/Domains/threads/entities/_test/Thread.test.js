const Thread = require('../Thread')

describe('a Thread entities', () => {
	it('should throw an error when given payload is invalid', () => {
		const payload = { title: null }

		expect(() => new Thread(payload)).toThrowError(
			'CREATE_THREAD.INVALID_PAYLOAD'
		)
	})
	it('should throw error when title or body are not a string', () => {
		const payload = {
			id: 1,
			title: 123,
			body: [],
		}

		expect(() => new Thread(payload)).toThrowError(
			'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should throw an error when id is integer', () => {
		const payload = { id: 123, title: 'title', body: 'body' }

		expect(() => new Thread(payload)).toThrowError(
			'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should throw error when title or body are reached the char limit', () => {
		const payload = {
			id: 'id',
			title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
			body: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
		}

		expect(() => new Thread(payload)).toThrowError(
			'CREATE_THREAD.PAYLOAD_LIMIT_CHAR'
		)
	})
	it('should created Thread object correctly', () => {
		const payload = {
			id: 'thread-123qweasdzxc890',
			title: 'title',
			body: 'body',
		}
		const thread = new Thread(payload)

		expect(thread.id).toEqual(payload.id)
		expect(thread.title).toEqual(payload.title)
		expect(thread.body).toEqual(payload.body)
	})
})
