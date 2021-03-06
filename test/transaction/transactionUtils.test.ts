import { Wallet } from '../../src/wallet/Wallet';
import {
	newTransaction,
	rewardTransaction,
	transactionToString,
	updateTransaction,
	verifyTransaction
} from '../../src/transaction/transactionUtils';
import '@relmify/jest-fp-ts';
import { TransactionInput } from '../../src/transaction/TransactionInput';
import SHA256 from 'crypto-js/sha256';
import * as E from 'fp-ts/Either';
import { Transaction } from '../../src/transaction/Transaction';
import { hashData } from '../../src/utils/cryptoUtils';
import { TransactionOutput } from '../../src/transaction/TransactionOutput';
import { signData } from '../../src/wallet/walletUtils';
import { nanoid } from 'nanoid';
import { unpackRight } from '../testutils/utilityFunctions';

const recipientAddress = 'recipient';
const wallet = new Wallet();

describe('transactionUtils', () => {
	it('transactionToString', () => {
		const input: TransactionInput = {
			timestamp: expect.any(String),
			amount: 10,
			address: 'address',
			signature: 'signature'
		};
		const outputs = [
			{
				amount: 1,
				address: 'a'
			}
		];
		const transaction: Transaction = {
			input,
			outputs,
			id: nanoid()
		};
		expect(transactionToString(transaction)).toEqual(`Transaction - 
		id     : ${transaction.id}
		input  : ${JSON.stringify(input, null, 2)}
		outputs: ${JSON.stringify(outputs, null, 2)}`);
	});

	describe('newTransaction', () => {
		it('creates transaction', () => {
			const transaction = newTransaction(wallet, recipientAddress, 200);
			const outputs = [
				{
					address: wallet.publicKey,
					amount: 300
				},
				{
					address: recipientAddress,
					amount: 200
				}
			];
			const input: TransactionInput = {
				timestamp: expect.any(String),
				amount: wallet.balance,
				address: wallet.publicKey,
				signature: unpackRight(
					signData(wallet, SHA256(JSON.stringify(outputs)).toString())
				)
			};
			expect(transaction).toEqualRight({
				id: expect.any(String),
				input,
				outputs
			});
		});

		it('exceeds sender balance and cannot create transaction', () => {
			const transaction = newTransaction(wallet, recipientAddress, 700);
			expect(transaction).toEqualLeft(
				new Error(`Amount 700 exceeds sender balance`)
			);
		});
	});

	it('rewardTransaction', () => {
		const blockchainWallet = new Wallet();
		const transaction = unpackRight(
			rewardTransaction(wallet, blockchainWallet)
		);
		expect(transaction).toEqual({
			input: {
				timestamp: expect.any(String),
				amount: 500,
				address: blockchainWallet.publicKey,
				signature: expect.any(String)
			},
			outputs: [
				{
					amount: 50,
					address: wallet.publicKey
				}
			],
			id: expect.any(String)
		});
	});

	describe('verifyTransaction', () => {
		let transaction1: Transaction;
		let transaction2: Transaction;
		beforeEach(() => {
			const transaction1Either = newTransaction(
				wallet,
				recipientAddress,
				100
			);
			expect(transaction1Either).toBeRight();
			transaction1 = (transaction1Either as E.Right<Transaction>).right;

			transaction2 = {
				input: transaction1.input,
				outputs: [
					...transaction1.outputs,
					{
						address: '123',
						amount: 456
					}
				],
				id: nanoid()
			};
		});

		it('valid transaction', () => {
			expect(verifyTransaction(transaction1)).toBe(true);
		});

		it('invalid transaction', () => {
			expect(verifyTransaction(transaction2)).toBe(false);
		});
	});

	describe('updateTransaction', () => {
		it('successfully updates transaction', () => {
			const transaction = (
				newTransaction(
					wallet,
					recipientAddress,
					200
				) as E.Right<Transaction>
			).right;
			const updatedTransaction = updateTransaction(
				transaction,
				wallet,
				recipientAddress,
				100
			);
			const outputs: ReadonlyArray<TransactionOutput> = [
				{
					address: wallet.publicKey,
					amount: 200
				},
				{
					address: recipientAddress,
					amount: 200
				},
				{
					address: recipientAddress,
					amount: 100
				}
			];
			const input: TransactionInput = {
				timestamp: expect.any(String),
				amount: wallet.balance,
				address: wallet.publicKey,
				signature: unpackRight(
					signData(wallet, unpackRight(hashData(outputs)))
				)
			};
			expect(updatedTransaction).toEqualRight({
				id: expect.any(String),
				input,
				outputs
			});
		});

		it('exceeds sender balance and cannot update', () => {
			const transaction = (
				newTransaction(
					wallet,
					recipientAddress,
					200
				) as E.Right<Transaction>
			).right;
			const updatedTransaction = updateTransaction(
				transaction,
				wallet,
				recipientAddress,
				500
			);
			expect(updatedTransaction).toEqualLeft(
				new Error('Amount 500 exceeds sender balance')
			);
		});

		it('cannot find existing sender output and cannot update', () => {
			const transaction = (
				newTransaction(
					wallet,
					recipientAddress,
					200
				) as E.Right<Transaction>
			).right;
			const newWallet = new Wallet();
			const updatedTransaction = updateTransaction(
				transaction,
				newWallet,
				recipientAddress,
				100
			);
			expect(updatedTransaction).toEqualLeft(
				new Error(
					'Cannot find existing output for sender wallet to update'
				)
			);
		});
	});
});
