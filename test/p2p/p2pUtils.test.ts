import { Blockchain } from '../../src/chain/Blockchain';
import { unpackRight } from '../testutils/utilityFunctions';
import { genesisBlock } from '../../src/block/blockUtils';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import {
	broadcastBlockchain,
	broadcastClearTransactions,
	broadcastTransaction,
	createP2pServer
} from '../../src/p2p/p2pUtils';
import '@relmify/jest-fp-ts';
import { P2pServer } from '../../src/p2p/P2pServer';
import {
	TestWebSocketHttpsServerWrapper,
	TestWebSocketServerWrapper,
	TestWebSocketWrapper
} from './TestWebSocketWrappers';
import { MessageType } from '../../src/p2p/SocketMessages';
import { newTransaction } from '../../src/transaction/transactionUtils';
import { Wallet } from '../../src/wallet/Wallet';

jest.mock('../../src/p2p/webSocketWrapperUtils', () => {
	return jest.requireActual('./testWebSocketWrapperUtils');
});

const validateHandleSocketConnection = (
	socket: TestWebSocketWrapper,
	p2pServer: P2pServer,
	blockchain: Blockchain
) => {
	expect(p2pServer.connectedSockets).toHaveLength(1);
	expect(p2pServer.connectedSockets[0]).toEqual(socket);

	expect(socket.events['message']).toHaveLength(1);
	expect(socket.sentData).toHaveLength(1);
	expect(socket.sentData[0]).toEqual(
		JSON.stringify({
			type: MessageType.CHAIN,
			data: blockchain.chain
		})
	);
};

const wallet = new Wallet();

describe('p2pUtils', () => {
	let blockchain: Blockchain;
	let transactionPool: TransactionPool;
	let p2pServer: P2pServer;
	beforeEach(() => {
		blockchain = new Blockchain(unpackRight(genesisBlock()));
		transactionPool = new TransactionPool();
		const httpsServer = new TestWebSocketHttpsServerWrapper();
		const wsServer = new TestWebSocketServerWrapper();
		p2pServer = new P2pServer(wsServer, httpsServer);
	});

	it('createP2pServer', () => {
		const result = createP2pServer(blockchain, transactionPool);
		expect(result).toBeRight();
		const resultP2pServer = unpackRight(result);
		expect(resultP2pServer instanceof P2pServer).toBeTruthy();
		const wsServer =
			resultP2pServer.webSocketServer as TestWebSocketServerWrapper;
		expect(wsServer.events['connection']).toHaveLength(1);

		const socket = new TestWebSocketWrapper('address');

		wsServer.events['connection'][0](socket);
		validateHandleSocketConnection(socket, resultP2pServer, blockchain);
	});

	it('broadcastBlockchain', () => {
		const socket = new TestWebSocketWrapper('address');
		p2pServer.addConnectedSocket(socket);
		broadcastBlockchain(p2pServer, blockchain);

		expect(socket.sentData).toHaveLength(1);
		expect(socket.sentData[0]).toEqual(
			JSON.stringify({
				type: MessageType.CHAIN,
				data: blockchain.chain
			})
		);
	});

	it('broadcastTransaction', () => {
		const socket = new TestWebSocketWrapper('address');
		p2pServer.addConnectedSocket(socket);
		const transaction = unpackRight(newTransaction(wallet, 'address', 100));
		broadcastTransaction(p2pServer, transaction);

		expect(socket.sentData).toHaveLength(1);
		expect(socket.sentData[0]).toEqual(
			JSON.stringify({
				type: MessageType.TRANSACTION,
				data: transaction
			})
		);
	});

	it('broadcastClearTransactions', () => {
		const socket = new TestWebSocketWrapper('address');
		p2pServer.addConnectedSocket(socket);
		broadcastClearTransactions(p2pServer);

		expect(socket.sentData).toHaveLength(1);
		expect(socket.sentData[0]).toEqual(
			JSON.stringify({
				type: MessageType.CLEAR_TRANSACTIONS,
				data: null
			})
		);
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
