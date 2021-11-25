import { P2pServer } from '../../src/p2p/P2pServer';
import {
	TestWebSocketHttpsServerWrapper,
	TestWebSocketServerWrapper,
	TestWebSocketWrapper
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
		const socket = new TestWebSocketWrapper('address');
		p2pServer.addConnectedSocket(socket);
		expect(p2pServer.connectedSockets).toEqual([socket]);
	});

	describe('updateSockets', () => {
		it('same length', () => {
			const socket1 = new TestWebSocketWrapper('1');
			const socket2 = new TestWebSocketWrapper('2');
			p2pServer.addConnectedSocket(socket1);
			p2pServer.addConnectedSocket(socket2);
			p2pServer.updateSockets([socket1, socket2]);
			expect(p2pServer.connectedSockets).toHaveLength(2);
		});

		it('new length', () => {
			const socket1 = new TestWebSocketWrapper('1');
			const socket2 = new TestWebSocketWrapper('2');
			p2pServer.addConnectedSocket(socket1);
			p2pServer.addConnectedSocket(socket2);
			p2pServer.updateSockets([socket1]);
			expect(p2pServer.connectedSockets).toHaveLength(1);
		});
	});

	it('listen', () => {
		const result = p2pServer.listen();
		expect(result).toBeRight();
		expect(httpsServer.listenPort).toEqual(5001);
	});
});
