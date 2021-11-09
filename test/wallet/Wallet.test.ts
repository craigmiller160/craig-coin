import { Wallet } from '../../src/wallet/Wallet';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import '@relmify/jest-fp-ts';
import { INITIAL_BALANCE } from '../../src/config';
import { unpackRight } from '../testutils/utilityFunctions';
import { newTransaction } from '../../src/transaction/transactionUtils';

describe('Wallet', () => {
	it('toString', () => {
		const wallet = new Wallet();
		expect(wallet.toString()).toEqual(`Wallet - 
		publicKey: ${wallet.publicKey}
		balance  : ${wallet.balance}`);
	});

	it('sign', () => {
		const dataHash = 'abcdefg';
		const wallet = new Wallet();
		const result = wallet.sign(dataHash);
		expect(result).toEqual(wallet.keyPair.sign(dataHash).toDER('hex'));
	});

	describe('createTransaction', () => {
		it('creates brand new transaction', () => {
			const recipient = 'recipient';
			const wallet = new Wallet();
			const pool = new TransactionPool();
			const transaction = wallet.createTransaction(recipient, 100, pool);
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
			const createdTransaction = wallet.createTransaction(
				recipient,
				200,
				pool
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
