import { Block } from '../block/Block';
import { Transaction } from '../transaction/Transaction';

export enum MessageType {
	CHAIN,
	TRANSACTION,
	CLEAR_TRANSACTIONS
}

export interface SocketMessage<T> {
	type: MessageType;
	data: T;
}

export interface ChainSocketMessage
	extends SocketMessage<ReadonlyArray<Block>> {
	type: MessageType.CHAIN;
}
export interface TransactionSocketMessage extends SocketMessage<Transaction> {
	type: MessageType.TRANSACTION;
}
export interface ClearTransactionsSocketMessage extends SocketMessage<null> {
	type: MessageType.CLEAR_TRANSACTIONS;
}
export type ReceivedSocketMessage = SocketMessage<unknown>;
