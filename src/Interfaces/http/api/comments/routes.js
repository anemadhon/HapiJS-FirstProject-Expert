const routes = handler => [
	{
		method: 'POST',
		path: '/threads/{threadId}/comments',
		handler: handler.postThreadHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
]

module.exports = routes
