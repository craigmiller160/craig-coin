import WebSocket, { Server } from 'ws';
import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';
import {
	ChainSocketMessage,
	ClearTransactionsSocketMessage,
	MessageType,
	ReceivedSocketMessage,
	TransactionSocketMessage
} from './SocketMessages';
import { logger } from '../logger';
import { createHttpsServer } from '../tls';
import { P2pServer } from './P2pServer';
import { Transaction } from '../transaction/Transaction';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';

const PEERS: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];

export const createP2pServer = (
	blockchain: Blockchain,
	transactionPool: TransactionPool
): E.Either<Error, P2pServer> =>
	E.tryCatch(() => {
		const httpsServer = createHttpsServer();
		const webSocketServer = new Server({
			server: httpsServer
		});
		const p2pServer = new P2pServer(webSocketServer, httpsServer);
		webSocketServer.on('connection', (socket: WebSocket) =>
			handleSocketConnection(
				socket,
				p2pServer,
				blockchain,
				transactionPool
			)
		);
		return p2pServer;
	}, unknownToError);

export const handleSocketConnection = (
	socket: WebSocket,
	p2pServer: P2pServer,
	blockchain: Blockchain,
	transactionPool: TransactionPool
) => {
	socketMessageHandler(socket, blockchain, transactionPool);
	p2pServer.addConnectedSocket(socket);
	logger.debug('Socket connected');
	sendBlockchain(socket, blockchain);
	// TODO do I want to send pending transactions right away?
};

export const sendBlockchain = (socket: WebSocket, blockchain: Blockchain) => {
	const chainMessage: ChainSocketMessage = {
		type: MessageType.CHAIN,
		data: blockchain.chain
	};
	// TODO error handling here
	socket.send(JSON.stringify(chainMessage));
};

export const sendTransaction = (
	socket: WebSocket,
	transaction: Transaction
) => {
	const transactionMessage: TransactionSocketMessage = {
		type: MessageType.TRANSACTION,
		data: transaction
	};
	// TODO error handling here
	socket.send(JSON.stringify(transactionMessage));
};

export const sendClearTransactions = (socket: WebSocket) => {
	const clearTransactionsMessage: ClearTransactionsSocketMessage = {
		type: MessageType.CLEAR_TRANSACTIONS,
		data: null
	};
	// TODO error handling here
	socket.send(JSON.stringify(clearTransactionsMessage));
};

export const broadcastBlockchain = (
	p2pServer: P2pServer,
	blockchain: Blockchain
) => {
	p2pServer.connectedSockets.forEach((socket) => {
		sendBlockchain(socket, blockchain);
	});
};

export const broadcastTransaction = (
	p2pServer: P2pServer,
	transaction: Transaction
) => {
	p2pServer.connectedSockets.forEach((socket) => {
		sendTransaction(socket, transaction);
	});
};

export const broadcastClearTransactions = (p2pServer: P2pServer) => {
	p2pServer.connectedSockets.forEach((socket) => {
		sendClearTransactions(socket);
	});
};

export const socketMessageHandler = (
	socket: WebSocket,
	blockchain: Blockchain,
	transactionPool: TransactionPool
) => {
	socket.on('message', (message: string) => {
		// TODO what about errors here?
		const receivedMessage = JSON.parse(message) as ReceivedSocketMessage;
		switch (receivedMessage.type) {
			case MessageType.CHAIN:
				blockchain.replaceChain(
					(receivedMessage as ChainSocketMessage).data
				);
				break;
			case MessageType.TRANSACTION:
				transactionPool.updateOrAddTransaction(
					(receivedMessage as TransactionSocketMessage).data
				);
				break;
			case MessageType.CLEAR_TRANSACTIONS:
				transactionPool.clear();
				break;
			default:
				logger.error(
					`Invalid message received. Type: ${receivedMessage.type}`
				);
				break;
		}
	});
};

export const connectToPeers = (
	p2pServer: P2pServer,
	blockchain: Blockchain,
	transactionPool: TransactionPool
) => {
	PEERS.forEach((peer) => {
		// TODO error handling here
		const socket = new WebSocket(peer, {
			rejectUnauthorized: false
		});
		socket.on('open', () =>
			handleSocketConnection(
				socket,
				p2pServer,
				blockchain,
				transactionPool
			)
		);
		logger.debug(`Opening socket to peer: ${peer}`);
	});
};
