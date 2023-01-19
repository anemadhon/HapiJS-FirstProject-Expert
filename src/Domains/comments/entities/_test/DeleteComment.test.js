const DeleteComment = require('../DeleteComment')

describe('a DeleteComment entities', () => {
    it('should return status success when comment deleted', () => {
		const deletedComment = new DeleteComment()

		expect(deletedComment.status).toEqual('success')
	})
})