const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const ClientError = require('../../Commons/exceptions/ClientError')
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator')
const comments = require('../../Interfaces/http/api/comments')
const threads = require('../../Interfaces/http/api/threads')
const users = require('../../Interfaces/http/api/users')
const authentications = require('../../Interfaces/http/api/authentications')

const createServer = async container => {
	const server = Hapi.server({
		host: process.env.HOST,
		port: process.env.PORT,
	})

	await server.register([
		{
			plugin: Jwt,
		},
	])

	server.auth.strategy('forumapi_jwt', 'jwt', {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: process.env.ACCESS_TOKEN_AGE,
		},
		validate: artifacts => ({
			isValid: true,
			credentials: {
				id: artifacts.decoded.payload.id,
				username: artifacts.decoded.payload.username,
			},
		}),
	})

	await server.register([
		{
			plugin: comments,
			options: { container },
		},
		{
			plugin: threads,
			options: { container },
		},
		{
			plugin: users,
			options: { container },
		},
		{
			plugin: authentications,
			options: { container },
		},
	])

	server.ext('onPreResponse', (request, h) => {
		// mendapatkan konteks response dari request
		const { response } = request

		if (response instanceof Error) {
			// bila response tersebut error, tangani sesuai kebutuhan
			const translatedError = DomainErrorTranslator.translate(response)

			// penanganan client error secara internal.
			if (translatedError instanceof ClientError) {
				return h
					.response({
						status: 'fail',
						message: translatedError.message,
					})
					.code(translatedError.statusCode)
			}

			// mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
			if (!translatedError.isServer) {
				return h.continue
			}

			// penanganan server error sesuai kebutuhan
			return h
				.response({
					status: 'error',
					message: 'terjadi kegagalan pada server kami',
				})
				.code(500)
		}

		// jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
		return h.continue
	})

	return server
}

module.exports = createServer
