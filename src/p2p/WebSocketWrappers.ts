import WebSocket from 'ws';

export interface WebSocketWrapper {
	address: string;
	options?: WebSocket.ClientOptions;
}

export class WebSocketWrapperImpl implements WebSocketWrapper {
	#webSocket: WebSocket;
	constructor(
		public address: string,
		public options?: WebSocket.ClientOptions
	) {
		this.#webSocket = new WebSocket(address, options);
	}
}
