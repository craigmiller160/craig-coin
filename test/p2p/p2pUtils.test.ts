import { Blockchain } from '../../src/chain/Blockchain';
import { unpackRight } from '../testutils/utilityFunctions';
import { genesisBlock } from '../../src/block/blockUtils';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import { createP2pServer } from '../../src/p2p/p2pUtils';
import '@relmify/jest-fp-ts';
import { P2pServer } from '../../src/p2p/P2pServer';

jest.mock('../../src/p2p/webSocketWrapperUtils', () => {
	return jest.requireActual('./testWebSocketWrapperUtils');
});

const validateHandleSocketConnection = (
	p2pServer: P2pServer,
	blockchain: Blockchain
) => {
	// expect(p2pServer.connectedSockets).toHaveLength(1);
	// expect(onMessageFns).toHaveLength(1);
	// expect(messagesSent).toHaveLength(1);
	// expect(messagesSent[0]).toEqual(
	// 	JSON.stringify({
	// 		type: MessageType.CHAIN,
	// 		data: blockchain.chain
	// 	})
	// );
};

describe('p2pUtils', () => {
	let blockchain: Blockchain;
	let transactionPool: TransactionPool;
	beforeEach(() => {
		blockchain = new Blockchain(unpackRight(genesisBlock()));
		transactionPool = new TransactionPool();
		// clearFnArrays();
	});

	afterEach(() => {
		// clearFnArrays();
	});

	it('createP2pServer', () => {
		const result = createP2pServer(blockchain, transactionPool);
		expect(result).toBeRight();
		const p2pServer = unpackRight(result);
		// expect(p2pServer instanceof P2pServer).toBeTruthy();
		// expect(onConnectionFns).toHaveLength(1);
		// const socket = new MockWebSocket();
		// onConnectionFns[0](socket);
		// validateHandleSocketConnection(p2pServer, blockchain);
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
