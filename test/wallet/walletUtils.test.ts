import { Wallet } from '../../src/wallet/Wallet';
import {
	calculateBalance,
	createTransaction,
	signData,
	walletToString
} from '../../src/wallet/walletUtils';
import { unpackRight } from '../testutils/utilityFunctions';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import { INITIAL_BALANCE } from '../../src/config';
import {
	newTransaction,
	updateTransaction
} from '../../src/transaction/transactionUtils';
import '@relmify/jest-fp-ts';
import { genesisBlock } from '../../src/block/blockUtils';
import { Blockchain } from '../../src/chain/Blockchain';

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
			const blockchain = new Blockchain(unpackRight(genesisBlock()));
			const transaction = createTransaction(
				wallet,
				blockchain,
				pool,
				recipient,
				100
			);
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
			const blockchain = new Blockchain(unpackRight(genesisBlock()));
			const transaction1 = unpackRight(
				newTransaction(wallet, recipient, 100)
			);
			const pool = new TransactionPool([transaction1]);
			const createdTransaction = createTransaction(
				wallet,
				blockchain,
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

	describe('calculateBalance', () => {
		const wallet1 = new Wallet();
		const wallet2 = new Wallet();
		const wallet3 = new Wallet();
		const blockchain = new Blockchain(unpackRight(genesisBlock()));
		const txn1 = unpackRight(
			newTransaction(wallet1, wallet2.publicKey, 100)
		);
		const txn2 = unpackRight(
			newTransaction(wallet2, wallet1.publicKey, 50)
		);
		blockchain.addBlock([txn1, txn2]);
		const txn3 = unpackRight(
			newTransaction(wallet2, wallet3.publicKey, 100)
		);
		const txn4 = unpackRight(
			newTransaction(wallet1, wallet2.publicKey, 50)
		);
		blockchain.addBlock([txn3, txn4]);
		const txn5 = unpackRight(
			newTransaction(wallet1, wallet3.publicKey, 100)
		);
		const txn6 = unpackRight(
			updateTransaction(txn5, wallet1, wallet2.publicKey, 50)
		);
		blockchain.addBlock([txn6]);

		it('has existing input for wallet', () => {
			const balance = calculateBalance(wallet2, blockchain);
			expect(balance).toEqual(500);
		});

		it('no existing input for wallet', () => {
			const balance = calculateBalance(wallet3, blockchain);
			expect(balance).toEqual(INITIAL_BALANCE + 200);
		});
	});
});
