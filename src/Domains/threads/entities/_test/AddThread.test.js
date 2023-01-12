const AddThread = require('../AddThread')

describe('a AddThread entities', () => {
	it('should throw error when title is empty', () => {
		const payload = {
			title: '',
			body: 'body',
		}

		expect(() => new AddThread(payload)).toThrowError(
			'CREATE_THREAD.INVALID_PAYLOAD'
		)
	})
	it('should throw error when body is empty', () => {
		const payload = {
			title: 'title',
			body: '',
		}

		expect(() => new AddThread(payload)).toThrowError(
			'CREATE_THREAD.INVALID_PAYLOAD'
		)
	})
	it('should throw error when title and body are empty', () => {
		const payload = {
			title: '',
			body: '',
		}

		expect(() => new AddThread(payload)).toThrowError(
			'CREATE_THREAD.INVALID_PAYLOAD'
		)
	})
	it('should throw error when title or body are not a string', () => {
		const payload = {
			title: 123,
			body: [],
			owner: 1,
		}

		expect(() => new AddThread(payload)).toThrowError(
			'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should throw error when title or body are reached the char limit', () => {
		const payload = {
			title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
			body: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
			owner: 'user-123',
		}

		expect(() => new AddThread(payload)).toThrowError(
			'CREATE_THREAD.PAYLOAD_LIMIT_CHAR'
		)
	})
	it('should create new Thread, return its object', () => {
		const payload = {
			title: 'title',
			body: 'body',
			owner: 'user-123',
		}
		const { title, body } = new AddThread(payload)

		expect(title).toEqual(payload.title)
		expect(body).toEqual(payload.body)
	})
})
