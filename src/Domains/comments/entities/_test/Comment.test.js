const Comment = require('../Comment')

describe('a Comment entities', () => {
    it('should throw an error when payload is invalid', () => {
        const incomplatePayload = {
            content: 'content'
        }

        expect(() => new Comment(incomplatePayload)).toThrowError('CREATE_COMMENT.INVALID_PAYLOAD')
        
        const invalidPayload = {
            id: null,
            content: 'content',
            owner: ''
        }

        expect(() => new Comment(invalidPayload)).toThrowError('CREATE_COMMENT.INVALID_PAYLOAD')
    })
    it('should throws an error when payload values is not a string', () => {
        const invalidPayload = {
            id: 1,
            content: 'content',
            owner: true
        }

        expect(() => new Comment(invalidPayload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })
    it('should return created Comment object correctly', () => {
		const payload = {
            id: 'id',
			content: 'content',
            owner: 'user-123'
		}
		const { id, content, owner } = new Comment(payload)

		expect(id).toEqual(payload.id)
		expect(content).toEqual(payload.content)
		expect(owner).toEqual(payload.owner)
	})
})