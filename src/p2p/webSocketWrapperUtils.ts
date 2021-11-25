import WebSocket, { Server } from 'ws';
import {
	WebSocketHttpsServerWrapper,
	WebSocketHttpsServerWrapperImpl,
	WebSocketServerWrapper,
	WebSocketServerWrapperImpl,
	WebSocketWrapper,
	WebSocketWrapperImpl
} from './WebSocketWrappers';
import { createHttpsServer } from '../tls';

export const newWebSocketWrapper = (
	address: string,
	options?: WebSocket.ClientOptions
): WebSocketWrapper => {
	const socket = new WebSocket(address, options);
	return new WebSocketWrapperImpl(socket);
};

export type NewWebSocketServerResult = [
	WebSocketServerWrapper,
	WebSocketHttpsServerWrapper
];
export const newWebSocketServerWrapper = (): NewWebSocketServerResult => {
	const httpsServer = createHttpsServer();
	const httpsServerWrapper = new WebSocketHttpsServerWrapperImpl(httpsServer);
	const webSocketServer = new Server({
		server: httpsServer
	});
	const webSocketServerWrapper = new WebSocketServerWrapperImpl(
		webSocketServer
	);
	return [webSocketServerWrapper, httpsServerWrapper];
};
