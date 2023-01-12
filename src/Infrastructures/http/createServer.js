const Hapi = require('@hapi/hapi')
const ClientError = require('../../Commons/exceptions/ClientError')
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator')
const users = require('../../Interfaces/http/api/users')
const authentications = require('../../Interfaces/http/api/authentications')

const createServer = async container => {
	const server = Hapi.server({
		host: process.env.HOST,
		port: process.env.PORT,
	})

	await server.register([
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
