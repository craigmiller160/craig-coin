import {
	newTransaction,
	updateTransaction
} from '../../src/transaction/transactionUtils';
import { Wallet } from '../../src/wallet/Wallet';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import { unpackRight } from '../testutils/utilityFunctions';

const wallet = new Wallet();
const recipient = 'recipient';

describe('TransactionPool', () => {
	describe('updateOrAddTransaction', () => {
		it('updates existing transaction', () => {
			const transaction = unpackRight(
				newTransaction(wallet, recipient, 100)
			);
			const transaction2 = unpackRight(
				newTransaction(wallet, recipient, 200)
			);
			const pool = new TransactionPool([transaction, transaction2]);
			const transaction3 = unpackRight(
				updateTransaction(transaction, wallet, recipient, 100)
			);
			pool.updateOrAddTransaction(transaction3);
			expect(pool.transactions).toHaveLength(2);
			expect(pool.transactions).toEqual([transaction3, transaction2]);
		});

		it('adds new transaction', () => {
			const transaction = unpackRight(
				newTransaction(wallet, recipient, 100)
			);
			const transaction2 = unpackRight(
				newTransaction(wallet, recipient, 200)
			);

			const pool = new TransactionPool([transaction, transaction2]);
			const transaction3 = unpackRight(
				newTransaction(new Wallet(), recipient, 300)
			);
			pool.updateOrAddTransaction(transaction3);
			expect(pool.transactions).toHaveLength(3);
			expect(pool.transactions).toEqual([
				transaction,
				transaction2,
				transaction3
			]);
		});
	});

	it('clear', () => {
		throw new Error();
	});

	it('updateTransaction', () => {
		const transaction1 = unpackRight(
			newTransaction(wallet, recipient, 100)
		);
		const pool = new TransactionPool([transaction1]);
		const transaction2 = unpackRight(
			updateTransaction(transaction1, wallet, recipient, 100)
		);
		const oldTransactions = pool.transactions;
		pool.updateTransaction(0, transaction2);
		expect(oldTransactions).toEqual([transaction1]);
		expect(pool.transactions).toEqual([transaction2]);
	});

	it('addTransaction', () => {
		const transaction1 = unpackRight(
			newTransaction(wallet, recipient, 100)
		);
		const pool = new TransactionPool();
		const oldTransactions = pool.transactions;
		pool.addTransaction(transaction1);
		expect(oldTransactions).toEqual([]);
		expect(pool.transactions).toEqual([transaction1]);
	});
});
