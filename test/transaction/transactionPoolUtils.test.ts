import { unpackRight } from '../testutils/utilityFunctions';
import { newTransaction } from '../../src/transaction/transactionUtils';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import { Wallet } from '../../src/wallet/Wallet';
import {
	getExistingTransaction,
	getExistingTransactionIndex, getValidTransactions
} from '../../src/transaction/transactionPoolUtils';
import {Transaction} from '../../src/transaction/Transaction';
import {nanoid} from 'nanoid';

const wallet = new Wallet();
const recipient = 'recipient';

describe('transactionPoolUtils', () => {
	describe('getExistingTransaction', () => {
		it('transaction does exist', () => {
			const transaction1 = unpackRight(
				newTransaction(wallet, recipient, 100)
			);
			const pool = new TransactionPool([transaction1]);
			const existingTransaction = getExistingTransaction(
				pool,
				transaction1.input.address
			);
			expect(existingTransaction).toEqual(transaction1);
		});

		it('transaction does not exist', () => {
			const transaction1 = unpackRight(
				newTransaction(wallet, recipient, 100)
			);
			const pool = new TransactionPool([transaction1]);
			const existingTransaction = getExistingTransaction(pool, 'abc');
			expect(existingTransaction).toBeUndefined();
		});
	});

	describe('getExistingTransactionIndex', () => {
		it('transaction does exist', () => {
			const transaction1 = unpackRight(
				newTransaction(wallet, recipient, 100)
			);
			const pool = new TransactionPool([transaction1]);
			const index = getExistingTransactionIndex(pool, wallet.publicKey);
			expect(index).toEqual(0);
		});

		it('transaction does not exist', () => {
			const transaction1 = unpackRight(
				newTransaction(wallet, recipient, 100)
			);
			const pool = new TransactionPool([transaction1]);
			const index = getExistingTransactionIndex(pool, 'abc');
			expect(index).toEqual(-1);
		});
	});

	it('getValidTransactions', () => {
		const validTransaction = unpackRight(
			newTransaction(wallet, recipient, 100)
		);
		const invalidInputAmountTransaction: Transaction = {
			...validTransaction,
			input: {
				...validTransaction.input,
				amount: 0
			},
			id: nanoid()
		};
		const invalidSignatureTransaction: Transaction = {
			...validTransaction,
			input: {
				...validTransaction.input,
				signature: 'abc'
			},
			id: nanoid()
		};
		const pool = new TransactionPool([validTransaction, invalidInputAmountTransaction, invalidSignatureTransaction]);
		const validTransactions = getValidTransactions(pool);
		expect(validTransactions).toEqual([validTransaction]);
	});
});
