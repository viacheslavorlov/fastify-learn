import fastify from 'fastify';
import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';

const serverOptions = { logger: false };
const server = fastify(serverOptions).withTypeProvider<JsonSchemaToTsProvider>();

server.addHook('onRoute', function inspector(routeOptions) {
	console.log('routeOptions', routeOptions);
});
server.addHook('onRegister', function inspector(plugin, pluginOptions) {
	console.log('Chapter 2, Plugin System and Boot Process');
});
server.addHook('onReady', function preLoading(done) {
	console.log('onReady');
	done();
});
server.addHook('onClose', function manageClose(done) {
	console.log('onClose');
	// done();
});

server.route({
	method: 'GET',
	url: '/',
	handler: (request, reply) => {
		reply.send({ hello: 'world' });
	},
});

server.route({
	method: 'GET',
	url: '/hello',
	handler: (request, reply) => {
		reply.headers({ accept: 'text/html', authorization: 'Bearer 12345' });
		console.log('request.headers', reply.getHeaders());

		console.log('url', request.url);
		reply.send({ root: true });
	},
});
//@ts-ignore
function business(request, reply) {
	console.log('request', request);
	//@ts-ignore
	// `this` is the Fastify application instance
	reply.send({ helloFrom: this.server.address() });
	
}
server.get('/server', business);

server.get('/fail', (request, reply) => {
	// `this` is undefined
	console.log('fail', this);
	// @ts-ignore
	reply.send({ helloFrom: this.server.address() });
});

server
	.listen({
		port: 3000,
		host: '0.0.0.0',
	})
	.then(address => {
		console.log(`server listening on ${address}`);
	});
