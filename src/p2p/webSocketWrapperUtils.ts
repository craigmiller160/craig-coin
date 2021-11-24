import WebSocket from 'ws';
import { WebSocketWrapperImpl } from './WebSocketWrappers';

export const newWebSocketWrapper = (
	address: string,
	options?: WebSocket.ClientOptions
) => new WebSocketWrapperImpl(address, options);
