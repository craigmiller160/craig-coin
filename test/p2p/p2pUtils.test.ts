import { Blockchain } from '../../src/chain/Blockchain';
import { unpackRight } from '../testutils/utilityFunctions';
import { genesisBlock } from '../../src/block/blockUtils';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import {
	broadcastBlockchain,
	broadcastClearTransactions,
	broadcastTransaction,
	connectToPeers,
	createP2pServer,
	socketMessageHandler
} from '../../src/p2p/p2pUtils';
import '@relmify/jest-fp-ts';
import { P2pServer } from '../../src/p2p/P2pServer';
import {
	TestWebSocketHttpsServerWrapper,
	TestWebSocketServerWrapper,
	TestWebSocketWrapper
} from '../testutils/TestWebSocketWrappers';
import {
	ChainSocketMessage,
	ClearTransactionsSocketMessage,
	MessageType,
	TransactionSocketMessage
} from '../../src/p2p/SocketMessages';
import { newTransaction } from '../../src/transaction/transactionUtils';
import { Wallet } from '../../src/wallet/Wallet';

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

	afterEach(() => {
		process.env.PEERS = undefined;
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
		it('no message', () => {
			const socket = new TestWebSocketWrapper('');
			socketMessageHandler(socket, blockchain, transactionPool);
			expect(socket.events['message']).toHaveLength(1);
			socket.events['message'][0]();
			expect(blockchain.chain).toHaveLength(1);
			expect(transactionPool.transactions).toHaveLength(0);
		});

		it('MessageType.CHAIN', () => {
			const socket = new TestWebSocketWrapper('');
			socketMessageHandler(socket, blockchain, transactionPool);
			expect(socket.events['message']).toHaveLength(1);
			const newBlockchain = new Blockchain(unpackRight(genesisBlock()));
			const theNewTransaction = unpackRight(
				newTransaction(wallet, 'address', 100)
			);
			newBlockchain.addBlock([theNewTransaction]);

			const message: ChainSocketMessage = {
				type: MessageType.CHAIN,
				data: newBlockchain.chain
			};

			socket.events['message'][0](JSON.stringify(message));

			expect(blockchain.chain).toHaveLength(2);
			expect(blockchain.chain).toEqual(newBlockchain.chain);
		});

		it('MessageType.ALL_TRANSACTIONS', () => {
			throw new Error();
		});

		it('MessageType.TRANSACTION', () => {
			const socket = new TestWebSocketWrapper('');
			socketMessageHandler(socket, blockchain, transactionPool);
			expect(socket.events['message']).toHaveLength(1);
			const theNewTransaction = unpackRight(
				newTransaction(wallet, 'address', 100)
			);

			const message: TransactionSocketMessage = {
				type: MessageType.TRANSACTION,
				data: theNewTransaction
			};

			socket.events['message'][0](JSON.stringify(message));
			expect(blockchain.chain).toHaveLength(1);
			expect(transactionPool.transactions).toHaveLength(1);
		});

		it('MessageType.CLEAR_TRANSACTIONS', () => {
			const socket = new TestWebSocketWrapper('');
			socketMessageHandler(socket, blockchain, transactionPool);
			expect(socket.events['message']).toHaveLength(1);
			const theNewTransaction = unpackRight(
				newTransaction(wallet, 'address', 100)
			);
			transactionPool.updateOrAddTransaction(theNewTransaction);

			const message: ClearTransactionsSocketMessage = {
				type: MessageType.CLEAR_TRANSACTIONS,
				data: null
			};

			socket.events['message'][0](JSON.stringify(message));
			expect(blockchain.chain).toHaveLength(1);
			expect(transactionPool.transactions).toHaveLength(0);
		});

		it('unknown type', () => {
			const socket = new TestWebSocketWrapper('');
			socketMessageHandler(socket, blockchain, transactionPool);
			expect(socket.events['message']).toHaveLength(1);

			const message = {
				type: 'abc',
				data: 'def'
			};

			socket.events['message'][0](JSON.stringify(message));
			expect(blockchain.chain).toHaveLength(1);
			expect(transactionPool.transactions).toHaveLength(0);
		});

		it('parsing error', () => {
			const socket = new TestWebSocketWrapper('');
			socketMessageHandler(socket, blockchain, transactionPool);
			expect(socket.events['message']).toHaveLength(1);

			socket.events['message'][0]('<h1>Hello</h1>');
			expect(blockchain.chain).toHaveLength(1);
			expect(transactionPool.transactions).toHaveLength(0);
		});
	});

	it('connectToPeers', () => {
		const address = 'peerAddress';
		process.env.PEERS = address;
		const socketEithers = connectToPeers(
			p2pServer,
			blockchain,
			transactionPool
		);
		expect(socketEithers).toHaveLength(1);
		const socket = unpackRight(socketEithers[0]) as TestWebSocketWrapper;
		expect(socket.address).toEqual(address);
		expect(socket.events['open']).toHaveLength(1);
		socket.events['open'][0]();

		validateHandleSocketConnection(socket, p2pServer, blockchain);
	});
});
