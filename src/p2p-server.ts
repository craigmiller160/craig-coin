import WebSocket, { Server } from 'ws';
import { Blockchain } from './chain/Blockchain';
import { Block } from './block/Block';
import { logger } from './logger';
import { TransactionPool } from './transaction/TransactionPool';
import { Transaction } from './transaction/Transaction';
import { createHttpsServer } from './tls';

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;
const PEERS: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];

// TODO delete this entire file

enum MessageType {
	CHAIN,
	TRANSACTION,
	CLEAR_TRANSACTIONS
}

interface Message<T> {
	type: MessageType;
	data: T;
}
interface ChainMessage extends Message<ReadonlyArray<Block>> {
	type: MessageType.CHAIN;
}
interface TransactionMessage extends Message<Transaction> {
	type: MessageType.TRANSACTION;
}
interface ClearTransactionsMessage extends Message<null> {
	type: MessageType.CLEAR_TRANSACTIONS;
}
type ReceivedMessage = Message<unknown>;

export class P2pServer {
	#sockets: ReadonlyArray<WebSocket> = [];
	constructor(
		public readonly blockchain: Blockchain,
		public readonly transactionPool: TransactionPool
	) {}

	listen() {
		const httpsServer = createHttpsServer();
		const webSocketServer = new Server({
			server: httpsServer
		});
		webSocketServer.on('connection', (socket) =>
			this.#connectSocket(socket)
		);
		logger.info(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
		httpsServer.listen(P2P_PORT);

		this.#connectToPeers();
	}

	#sendChain(socket: WebSocket) {
		const chainMessage: ChainMessage = {
			type: MessageType.CHAIN,
			data: this.blockchain.chain
		};
		socket.send(JSON.stringify(chainMessage));
	}

	#sendTransaction(socket: WebSocket, transaction: Transaction) {
		const transactionMessage: TransactionMessage = {
			type: MessageType.TRANSACTION,
			data: transaction
		};
		socket.send(JSON.stringify(transactionMessage));
	}

	#connectSocket(socket: WebSocket) {
		this.#messageHandler(socket);
		this.#sockets = [...this.#sockets, socket];
		logger.debug('Socket Connected');

		this.#sendChain(socket);
	}

	#messageHandler(socket: WebSocket) {
		socket.on('message', (message: string) => {
			const receivedMessage = JSON.parse(message) as ReceivedMessage;
			switch (receivedMessage.type) {
				case MessageType.CHAIN:
					this.blockchain.replaceChain(
						(receivedMessage as ChainMessage).data
					);
					break;
				case MessageType.TRANSACTION:
					this.transactionPool.updateOrAddTransaction(
						(receivedMessage as TransactionMessage).data
					);
					break;
				case MessageType.CLEAR_TRANSACTIONS:
					this.transactionPool.clear();
					break;
				default:
					logger.error(
						`Invalid message received. Type: ${receivedMessage.type}`
					);
			}
		});
	}

	syncChains() {
		this.#sockets.forEach((socket) => this.#sendChain(socket));
	}

	broadcastTransaction(transaction: Transaction) {
		this.#sockets.forEach((socket) => {
			this.#sendTransaction(socket, transaction);
		});
	}

	broadcastClearTransactions() {
		this.#sockets.forEach((socket) => {
			const message: ClearTransactionsMessage = {
				type: MessageType.CLEAR_TRANSACTIONS,
				data: null
			};
			socket.send(JSON.stringify(message));
		});
	}

	#connectToPeers() {
		PEERS.forEach((peer) => {
			const socket = new WebSocket(peer, {
				rejectUnauthorized: false
			});
			socket.on('open', () => this.#connectSocket(socket));
			logger.debug(`Opening socket to peer: ${peer}`);
		});
	}
}
