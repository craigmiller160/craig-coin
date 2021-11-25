import { P2pServer } from '../../src/p2p/P2pServer';
import {
	TestWebSocketHttpsServerWrapper,
	TestWebSocketServerWrapper
} from '../testutils/TestWebSocketWrappers';
import '@relmify/jest-fp-ts';

describe('P2pServer', () => {
	let p2pServer: P2pServer;
	let httpsServer: TestWebSocketHttpsServerWrapper;
	beforeEach(() => {
		httpsServer = new TestWebSocketHttpsServerWrapper();
		const wsServer = new TestWebSocketServerWrapper();
		p2pServer = new P2pServer(wsServer, httpsServer);
	});

	it('addConnectedSocket', () => {
		throw new Error();
	});

	describe('updateSockets', () => {
		it('same length', () => {
			throw new Error();
		});

		it('new length', () => {
			throw new Error();
		});
	});

	it('listen', () => {
		const result = p2pServer.listen();
		expect(result).toBeRight();
		expect(httpsServer.listenPort).toEqual(5001);
	});
});
