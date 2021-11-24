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
import { P2pServer } from './P2pServer';
import { Transaction } from '../transaction/Transaction';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';
import { pipe } from 'fp-ts/function';
import {
	newWebSocketServerWrapper,
	newWebSocketWrapper
} from './webSocketWrapperUtils';
import { WebSocketWrapper } from './WebSocketWrappers';

const getPeers = (): string[] =>
	process.env.PEERS ? process.env.PEERS.split(',') : [];

export const createP2pServer = (
	blockchain: Blockchain,
	transactionPool: TransactionPool
): E.Either<Error, P2pServer> =>
	E.tryCatch(() => {
		const [webSocketServer, httpsServer] = newWebSocketServerWrapper();

		const p2pServer = new P2pServer(webSocketServer, httpsServer);
		webSocketServer.on('connection', (socket: WebSocketWrapper) =>
			handleSocketConnection(
				socket,
				p2pServer,
				blockchain,
				transactionPool
			)
		);
		return p2pServer;
	}, unknownToError);

const handleSocketConnection = (
	socket: WebSocketWrapper,
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

const sendBlockchain = (socket: WebSocketWrapper, blockchain: Blockchain) => {
	const chainMessage: ChainSocketMessage = {
		type: MessageType.CHAIN,
		data: blockchain.chain
	};

	E.tryCatch(
		() => socket.send(JSON.stringify(chainMessage)),
		(error) => {
			logger.error('Error sending Blockchain to socket');
			logger.error(error);
		}
	);
};

const sendTransaction = (
	socket: WebSocketWrapper,
	transaction: Transaction
) => {
	const transactionMessage: TransactionSocketMessage = {
		type: MessageType.TRANSACTION,
		data: transaction
	};
	E.tryCatch(
		() => socket.send(JSON.stringify(transactionMessage)),
		(error) => {
			logger.error('Error sending Transaction to socket');
			logger.error(error);
		}
	);
};

const sendClearTransactions = (socket: WebSocketWrapper) => {
	const clearTransactionsMessage: ClearTransactionsSocketMessage = {
		type: MessageType.CLEAR_TRANSACTIONS,
		data: null
	};
	E.tryCatch(
		() => socket.send(JSON.stringify(clearTransactionsMessage)),
		(error) => {
			logger.error('Error sending Clear Transactions to socket');
			logger.error(error);
		}
	);
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

const parseSocketMessage = (
	message: string
): E.Either<Error, ReceivedSocketMessage> =>
	E.tryCatch(
		() => JSON.parse(message) as ReceivedSocketMessage,
		(error) => {
			logger.error('Error parsing message from socket');
			logger.error(error);
			return unknownToError(error);
		}
	);

export const socketMessageHandler = (
	socket: WebSocketWrapper,
	blockchain: Blockchain,
	transactionPool: TransactionPool
) => {
	socket.on('message', (message?: string) => {
		if (!message) {
			return;
		}

		pipe(
			parseSocketMessage(message),
			E.map((receivedMessage) => {
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
			})
		);
	});
};

export const connectToPeers = (
	p2pServer: P2pServer,
	blockchain: Blockchain,
	transactionPool: TransactionPool
) => {
	getPeers().forEach((peer) => {
		E.tryCatch(
			() => {
				const socket = newWebSocketWrapper(peer, {
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
			},
			(error) => {
				logger.error(`Error opening connection to peer: ${peer}`);
				logger.error(error);
			}
		);
	});
};
