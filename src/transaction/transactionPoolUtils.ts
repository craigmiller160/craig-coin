import { TransactionPool } from './TransactionPool';
import { Transaction } from './Transaction';

export const getExistingTransaction = (
	transactionPool: TransactionPool,
	senderAddress: string
): Transaction | undefined =>
	transactionPool.transactions.find(
		(txn) => txn.input.address === senderAddress
	);

export const getExistingTransactionIndex = (
	transactionPool: TransactionPool,
	senderAddress: string
): number =>
	transactionPool.transactions.findIndex(
		(txn) => txn.input.address === senderAddress
	);
