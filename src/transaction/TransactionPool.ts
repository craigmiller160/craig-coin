import { Transaction } from './Transaction';

// TODO make everything readonly if possible
export class TransactionPool {
	transactions: Transaction[] = [];

	// TODO need to do immutable update
	updateOrAddTransaction(transaction: Transaction) {
		const existingTransactionIndex = this.transactions.findIndex(
			(txn) => txn.id === transaction.id
		);
		if (existingTransactionIndex >= 0) {
			this.transactions[existingTransactionIndex] = transaction;
		} else {
			this.transactions.push(transaction);
		}
	}
}
