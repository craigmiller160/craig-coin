import { Transaction } from './Transaction';

export class TransactionPool {
	#transactions: ReadonlyArray<Transaction>;

	constructor(transactions: ReadonlyArray<Transaction> = []) {
		this.#transactions = transactions;
	}

	get transactions(): ReadonlyArray<Transaction> {
		return this.#transactions.slice();
	}

	getExistingTransaction(senderAddress: string): Transaction | undefined {
		return this.#transactions.find(
			(txn) => txn.input.address === senderAddress
		);
	}

	updateOrAddTransaction(transaction: Transaction) {
		const existingTransactionIndex = this.#transactions.findIndex(
			(txn) => txn.id === transaction.id
		);

		if (existingTransactionIndex >= 0) {
			this.#transactions = [
				...this.#transactions.slice(0, existingTransactionIndex),
				transaction,
				...this.#transactions.slice(existingTransactionIndex + 1)
			];
		} else {
			this.#transactions = [...this.#transactions, transaction];
		}
	}
}
