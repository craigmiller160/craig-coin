import WebSocket, { Server, ServerOptions } from 'ws';
import { createHttpsServer } from '../tls';

export interface WebSocketWrapper {
	on: (event: string, fn: (message?: string) => void) => void;
}

export interface WebSocketHttpsServerWrapper {
	listen: (port: number) => void;
}

export interface WebSocketServerWrapper {
	on: (event: string, fn: (socket: WebSocketWrapper) => void) => void;
}

export class WebSocketWrapperImpl implements WebSocketWrapper {
	#webSocket: WebSocket;
	constructor(webSocket: WebSocket) {
		this.#webSocket = webSocket;
	}

	on(event: string, fn: (message?: string) => void) {
		this.#webSocket.on(event, fn);
	}
}

export class WebSocketHttpsServerWrapperImpl
	implements WebSocketHttpsServerWrapper
{
	#httpsServer = createHttpsServer();
	listen(port: number) {
		this.#httpsServer.listen(port);
	}
}

export class WebSocketServerWrapperImpl implements WebSocketServerWrapper {
	#server: Server;
	constructor(options?: ServerOptions) {
		this.#server = new Server(options);
	}
	on(event: string, fn: (socket: WebSocketWrapper) => void) {
		this.#server.on(event, (ws: WebSocket) =>
			fn(new WebSocketWrapperImpl(ws))
		);
	}
}
