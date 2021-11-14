import { Transaction } from './Transaction';
import { getExistingTransactionIndex } from './transactionPoolUtils';

export class TransactionPool {
	#transactions: ReadonlyArray<Transaction>;

	constructor(transactions: ReadonlyArray<Transaction> = []) {
		this.#transactions = transactions;
	}

	get transactions(): ReadonlyArray<Transaction> {
		return this.#transactions.slice();
	}

	updateTransaction(index: number, transaction: Transaction) {
		this.#transactions = [
			...this.#transactions.slice(0, index),
			transaction,
			...this.#transactions.slice(index + 1)
		];
	}

	addTransaction(transaction: Transaction) {
		this.#transactions = [...this.#transactions, transaction];
	}

	updateOrAddTransaction(transaction: Transaction) {
		const existingTransactionIndex = getExistingTransactionIndex(
			this,
			transaction.input.address
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
