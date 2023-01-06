// const ClientError = require('../../../Commons/exceptions/ClientError') 

class AddThread {
    constructor({ title, body }) {
        if (!title || !body) {
            throw new Error('CREATE_THREAD.INVALID_PAYLOAD')
        }

        this.title = title
        this.body = body
    }
}

module.exports = AddThread