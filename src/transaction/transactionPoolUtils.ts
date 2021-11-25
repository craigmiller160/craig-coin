import { TransactionPool } from './TransactionPool';
import { Transaction } from './Transaction';
import { logger } from '../logger';
import { verifyTransaction } from './transactionUtils';

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

export const mergeTransactions = (
	transactionPool: TransactionPool,
	transactions: ReadonlyArray<Transaction>
) => {
	// TODO figure this out
};

export const getValidTransactions = (
	transactionPool: TransactionPool
): ReadonlyArray<Transaction> =>
	transactionPool.transactions.filter((txn) => {
		const totalOutputAmount = txn.outputs.reduce(
			(total, output) => total + output.amount,
			0
		);

		if (txn.input.amount !== totalOutputAmount) {
			logger.warn(
				`Invalid transaction from ${txn.input.address}. Total output amount does not equal input amount. Input: ${txn.input.amount} Output Total: ${totalOutputAmount}`
			);
			return false;
		}

		if (!verifyTransaction(txn)) {
			logger.warn(
				`Invalid transaction from ${txn.input.amount}. Invalid signature`
			);
			return false;
		}
		return true;
	});
