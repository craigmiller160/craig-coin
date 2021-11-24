import {
	TestWebSocketHttpsServerWrapper,
	TestWebSocketServerWrapper,
	TestWebSocketWrapper
} from './TestWebSocketWrappers';
import { NewWebSocketServerResult } from '../../src/p2p/webSocketWrapperUtils';

export const newWebSocketWrapper = (address: string) =>
	new TestWebSocketWrapper(address);

export const newWebSocketServerWrapper = (): NewWebSocketServerResult => {
	const httpsServer = new TestWebSocketHttpsServerWrapper();
	const webSocketServer = new TestWebSocketServerWrapper();
	return [webSocketServer, httpsServer];
};
