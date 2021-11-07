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
				newTransaction(wallet, recipient, 300)
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
});
