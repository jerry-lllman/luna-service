// import FastifyMultipart from '@fastify/multipart'
import { FastifyAdapter } from '@nestjs/platform-fastify'

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  logger: false,
})

// app.register(FastifyMultipart, {
//     limits: {
//         fields: 10, // Max number of non-file fields
//         fileSize: 1024 * 1024 * 6, // Limit file size to 6MB
//         files: 5, // Max number of file fields
//     }
// })

app.getInstance().addHook('onRequest', (request, reply, done) => {
  // set undefined origin
  const { origin } = request.headers
  if (!origin) {
    request.headers.origin = request.headers.host
  }

  const { url } = request

  // skip favicon request
  if (url.match(/favicon.icon$/) || url.match(/manifest.json$/)) {
    return reply.status(204).send()
  }

  done()
})

export { app as fastifyApp }
