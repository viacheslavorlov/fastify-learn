import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import fastify from 'fastify'
import fs from 'fs'

const serverOptions = { logger: false }
const server = fastify(serverOptions).withTypeProvider<JsonSchemaToTsProvider>()

server.addHook('onRoute', function inspector(routeOptions) {
  console.log('routeOptions', routeOptions.path, routeOptions.method)
})
server.addHook('onRegister', function inspector(plugin, pluginOptions) {
  console.log('Chapter 2, Plugin System and Boot Process')
})
server.addHook('onReady', function preLoading(done) {
  console.log('onReady')
  done()
})
server.addHook('onClose', function manageClose(done) {
  console.log('onClose')
  // done();
})

server.route({
  method: 'GET',
  url: '/',
  handler: (request, reply) => {
    reply.send({ hello: 'world' })
  },
})

server.route({
  method: 'GET',
  url: '/hello',
  handler: (request, reply) => {
    reply.headers({ accept: 'text/html', authorization: 'Bearer 12345' })
    console.log('request.headers', reply.getHeaders())

    console.log('url', request.url)
    reply.send({ root: true })
  },
})
//@ts-ignore
async function business(request, reply) {
  // @ts-ignore
  return { helloFrom: this.server.address() }
}
server.get('/server', business)

server.get('/fail', (request, reply) => {
  // `this` is undefined
  console.log('fail', this)
  // @ts-ignore
  reply.send({ helloFrom: this.server.address() })
})

server.get('/multi', function multi(request, reply) {
  reply.send('one')
  reply.send('two')
  reply.send('three')
  this.log.info('this line is executed')
})

async function foo(request, reply) {
  return { one: 1 }
}
async function bar(request, reply) {
  const oneResponse = await foo(request, reply)
  console.log('oneResponse', {
    one: oneResponse,
    two: 2,
  })

  return {
    one: oneResponse,
    two: 2,
  }
}
server.get('/foo', foo)
server.get('/bar', bar)

server.get('/file', function promiseHandler(request, reply) {
  const fileName = './package-lock.json'
  const readPromise = fs.promises.readFile(fileName, { encoding: 'utf8' })
  return readPromise
})

server
  .listen({
    port: 3000,
    host: '0.0.0.0',
  })
  .then((address) => {
    console.log(`server listening on ${address}`)
  })
