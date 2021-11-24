import WebSocket from 'ws';
import { Server } from 'https';
import { Blockchain } from '../../src/chain/Blockchain';
import { unpackRight } from '../testutils/utilityFunctions';
import { genesisBlock } from '../../src/block/blockUtils';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import { createP2pServer } from '../../src/p2p/p2pUtils';
import { MockWebSocketServer } from './p2pUtilsTestResources';

jest.mock('ws', () => {
	const resources = jest.requireActual('./p2pUtilsTestResources');
	return {
		default: resources.MockWebSocket,
		Server: resources.MockWebSocketServer
	}
});

jest.mock('../../src/tls', () => ({
	createHttpsServer: () => {
		class MockHttpsServer {}
		return new MockHttpsServer();
	}
}));

describe('p2pUtils', () => {
	let blockchain: Blockchain;
	let transactionPool: TransactionPool;
	beforeEach(() => {
		blockchain = new Blockchain(unpackRight(genesisBlock()));
		transactionPool = new TransactionPool();
	});

	it('createP2pServer', () => {
		const result = createP2pServer(blockchain, transactionPool);
		console.log(result); // TODO delete this
	});

	it('handleSocketConnection', () => {
		throw new Error();
	});

	it('broadcastBlockchain', () => {
		throw new Error();
	});

	it('broadcastTransaction', () => {
		throw new Error();
	});

	it('broadcastClearTransactions', () => {
		throw new Error();
	});

	describe('socketMessageHandler', () => {
		it('MessageType.CHAIN', () => {
			throw new Error();
		});

		it('MessageType.TRANSACTION', () => {
			throw new Error();
		});

		it('MessageType.CLEAR_TRANSACTIONS', () => {
			throw new Error();
		});

		it('unknown type', () => {
			throw new Error();
		});

		it('parsing error', () => {
			throw new Error();
		});
	});

	it('connectToPeers', () => {
		throw new Error();
	});
});
