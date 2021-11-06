import { Wallet } from '../../src/wallet/Wallet';
import {
	newTransaction,
	updateTransaction,
	verifyTransaction
} from '../../src/transaction/transactionUtils';
import '@relmify/jest-fp-ts';
import { TransactionInput } from '../../src/transaction/TransactionInput';
import SHA256 from 'crypto-js/sha256';
import * as E from 'fp-ts/Either';
import { Transaction } from '../../src/transaction/Transaction';
import { hashData } from '../../src/utils/cryptoUtils';

const recipientAddress = 'recipient';
const wallet = new Wallet();

describe('transactionUtils', () => {
	describe('newTransaction', () => {
		it('creates transaction', () => {
			const transaction = newTransaction(wallet, recipientAddress, 200);
			const outputs = [
				{
					amount: 300,
					address: wallet.publicKey
				},
				{
					amount: 200,
					address: recipientAddress
				}
			];
			const input: TransactionInput = {
				timestamp: expect.any(String),
				amount: wallet.balance,
				address: wallet.publicKey,
				signature: wallet.sign(
					SHA256(JSON.stringify(outputs)).toString()
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

			transaction2 = new Transaction(transaction1.input, [
				...transaction1.outputs,
				{
					address: '123',
					amount: 456
				}
			]);
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
			const outputs = [
				{
					amount: 200,
					address: recipientAddress
				},
				{
					amount: 200,
					address: wallet.publicKey
				},
				{
					amount: 100,
					address: recipientAddress
				}
			];
			const input: TransactionInput = {
				timestamp: expect.any(String),
				amount: wallet.balance,
				address: wallet.publicKey,
				signature: wallet.sign(hashData(outputs))
			};
			expect(updatedTransaction).toEqualRight({
				id: expect.any(String),
				input,
				outputs
			});
		});

		it('exceeds sender balance and cannot update', () => {
			throw new Error();
		});

		it('cannot find existing sender output and cannot update', () => {
			throw new Error();
		});
	});
});
