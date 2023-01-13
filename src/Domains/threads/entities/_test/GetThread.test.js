const GetThread = require('../GetThread')

describe('a GetThread entities', () => {
	it('should throw error when payload are invalid', () => {
		const payload = {
			id: '',
			title: '',
			body: '',
			date: '',
			username: '',
		}

		expect(() => new GetThread(payload)).toThrowError(
			'READ_THREAD.INVALID_PAYLOAD'
		)
	})
	it('should throw error when payload (except comments) are not a string', () => {
		const payload = {
			id: 1,
			title: 123,
			body: [],
			date: true,
			username: true,
			comments: [],
		}

		expect(() => new GetThread(payload)).toThrowError(
			'READ_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should throw error when payload (comments) are not an array', () => {
		const payload = {
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: '2023-01-13 09:05:12',
			username: 'dicoding',
			comments: 'comments',
		}

		expect(() => new GetThread(payload)).toThrowError(
			'READ_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})
	it('should create new Thread, return its object', () => {
		const payload = {
			id: 'thread-123',
			title: 'title',
			body: 'body',
			date: '2023-01-13 09:05:12',
			username: 'dicoding',
			comments: [],
		}
		const { id, title, body, date, username, comments } = new GetThread(payload)

		expect(id).toEqual(payload.id)
		expect(title).toEqual(payload.title)
		expect(body).toEqual(payload.body)
		expect(date).toEqual(payload.date)
		expect(username).toEqual(payload.username)
		expect(comments).toEqual(payload.comments)
	})
})
