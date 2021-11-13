import { Wallet } from '../../src/wallet/Wallet';
import {
	createTransaction,
	signData,
	walletToString
} from '../../src/wallet/walletUtils';
import { unpackRight } from '../testutils/utilityFunctions';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import { INITIAL_BALANCE } from '../../src/config';
import { newTransaction } from '../../src/transaction/transactionUtils';
import '@relmify/jest-fp-ts';

describe('walletUtils', () => {
	it('walletToString', () => {
		const wallet = new Wallet();
		expect(walletToString(wallet)).toEqual(`Wallet - 
		publicKey: ${wallet.publicKey}
		balance  : ${wallet.balance}`);
	});

	it('signData', () => {
		const dataHash = 'abcdefg';
		const wallet = new Wallet();
		const result = signData(wallet, dataHash);
		expect(result).toEqualRight(wallet.keyPair.sign(dataHash).toDER('hex'));
	});

	describe('createTransaction', () => {
		it('creates brand new transaction', () => {
			const recipient = 'recipient';
			const wallet = new Wallet();
			const pool = new TransactionPool();
			const transaction = createTransaction(wallet, pool, recipient, 100);
			expect(transaction).toEqualRight({
				id: expect.any(String),
				input: expect.any(Object),
				outputs: [
					{
						address: wallet.publicKey,
						amount: INITIAL_BALANCE - 100
					},
					{
						address: recipient,
						amount: 100
					}
				]
			});
			expect(pool.transactions).toHaveLength(1);
			expect(pool.transactions[0]).toEqual(unpackRight(transaction));
		});

		it('updates existing transaction', () => {
			const recipient = 'recipient';
			const wallet = new Wallet();
			const transaction1 = unpackRight(
				newTransaction(wallet, recipient, 100)
			);
			const pool = new TransactionPool([transaction1]);
			const createdTransaction = createTransaction(
				wallet,
				pool,
				recipient,
				200
			);
			expect(createdTransaction).toEqualRight({
				id: expect.any(String),
				input: expect.any(Object),
				outputs: [
					{
						address: wallet.publicKey,
						amount: INITIAL_BALANCE - 300
					},
					{
						address: recipient,
						amount: 100
					},
					{
						address: recipient,
						amount: 200
					}
				]
			});
			expect(pool.transactions).toHaveLength(1);
			expect(pool.transactions[0]).toEqual(
				unpackRight(createdTransaction)
			);
		});
	});
});
