import WebSocket, { Server } from 'ws';
import { Blockchain } from './chain/Blockchain';
import { Block } from './block/Block';
import { logger } from './logger';
import { TransactionPool } from './transaction/TransactionPool';
import { Transaction } from './transaction/Transaction';

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;
const PEERS: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];
const CHAIN_MESSAGE_TYPE = 'CHAIN';
const TRANSACTION_MESSAGE_TYPE = 'TRANSACTION';

enum MessageType {
	CHAIN,
	TRANSACTION
}

interface Message<T> {
	type: MessageType;
	data: T;
}
type ChainMessage = Message<ReadonlyArray<Block>>; // TODO set the type
type TransactionMessage = Message<Transaction>; // TODO set the type
type ReceivedMessage = Message<unknown>;

// TODO need to automatically lookup available peers
// TODO need to handle peer going down and coming back up
// TODO figure out how to unit test this

export class P2pServer {
	#sockets: ReadonlyArray<WebSocket> = [];
	constructor(
		public readonly blockchain: Blockchain,
		public readonly transactionPool: TransactionPool
	) {}

	listen() {
		const server = new Server({
			port: P2P_PORT
		});
		server.on('connection', (socket) => this.#connectSocket(socket));
		logger.info(`Listening for peer-to-peer connections on: ${P2P_PORT}`);

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
				case CHAIN_MESSAGE_TYPE:
					this.blockchain.replaceChain(
						(receivedMessage as ChainMessage).data
					);
					break;
				case TRANSACTION_MESSAGE_TYPE:
					this.transactionPool.updateOrAddTransaction(
						(receivedMessage as TransactionMessage).data
					);
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

	#connectToPeers() {
		PEERS.forEach((peer) => {
			const socket = new WebSocket(peer);
			socket.on('open', () => this.#connectSocket(socket));
			logger.debug(`Opening socket to peer: ${peer}`);
		});
	}
}
