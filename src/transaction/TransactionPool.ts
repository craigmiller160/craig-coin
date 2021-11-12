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

	getExistingTransactionIndex(senderAddress: string): number {
		return this.#transactions.findIndex(
			(txn) => txn.input.address === senderAddress
		);
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
