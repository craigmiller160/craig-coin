import WebSocket from 'ws';
import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';
import {
	ChainSocketMessage,
	MessageType,
	ReceivedSocketMessage,
	TransactionSocketMessage
} from './SocketMessages';
import { logger } from '../logger';

export const socketMessageHandler = (
	socket: WebSocket,
	blockchain: Blockchain,
	transactionPool: TransactionPool
) => {
	socket.on('message', (message: string) => {
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
